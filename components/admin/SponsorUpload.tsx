'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import type { SponsorLevel } from '@/types/database';
import { useSponsorLevels } from '@/hooks/useSponsorLevels';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { DropZone } from './DropZone';
import { ImagePreview } from './ImagePreview';
import { DialogClose } from '@/components/ui/dialog';
import { cn } from '@/lib/utils';

const formSchema = z.object({
  name: z.string().min(1, 'Sponsor name is required'),
  level: z.string().min(1, 'Sponsor level is required'),
  year: z.number().int().min(2024).max(2100),
  website: z.string().url().optional().or(z.literal('')),
});

/**
 * A form component for uploading sponsor information and logo
 * 
 * @remarks
 * This component provides a complete sponsor upload experience:
 * - Form for sponsor metadata (name, category, year, website)
 * - Image upload with preview
 * - Client-side validation
 * - Submission handling
 */
export function SponsorUpload() {
  const [file, setFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const { levels, isLoading, error } = useSponsorLevels();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      level: undefined,
      year: new Date().getFullYear(),
      website: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!file) {
      toast.error('Please select a logo image');
      return;
    }

    setIsUploading(true);
    try {
      // Create form data for the upload
      const formData = new FormData();
      formData.append('file', file);
      formData.append('metadata', JSON.stringify(values));

      const response = await fetch('/api/sponsors/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Upload error response:', errorData);
        throw new Error(errorData.error || 'Upload failed');
      }

      toast.success('Sponsor added successfully!');
      // Reset form and close dialog
      form.reset();
      setFile(null);
      // Trigger a page refresh to show the new sponsor
      window.location.reload();
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload sponsor information');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sponsor Name</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Enter sponsor name" 
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="level"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Sponsor Level</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value || ''}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a level" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {levels.map((level) => (
                    <SelectItem key={level.id} value={level.id}>
                      {level.name} (${level.amount.toLocaleString()})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="year"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Year</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  value={field.value || ''}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Website (Optional)</FormLabel>
              <FormControl>
                <Input
                  type="url"
                  placeholder="https://example.com"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

<div className="flex items-center gap-4 pt-4">
          <Button
            type="submit"
            disabled={isUploading}
            className={cn(
              "font-semibold tracking-tight",
              "bg-primary/90 hover:bg-primary text-white",
              "shadow-sm hover:shadow transition-all duration-200"
            )}
          >
            {isUploading ? 'Uploading...' : 'Add Sponsor Logo'}
          </Button>
        </div>

        <div className="space-y-4">
          <FormLabel>Logo</FormLabel>
          {file ? (
            <ImagePreview
              file={file}
              onRemove={() => setFile(null)}
            />
          ) : (
            <DropZone
              onFileSelect={setFile}
              disabled={isUploading}
            />
          )}
        </div>
      </form>
    </Form>
  );
}
