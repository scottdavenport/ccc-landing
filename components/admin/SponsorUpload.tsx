'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { SponsorCategory, SponsorMetadata } from '@/types/sponsor';
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

const sponsorCategories: SponsorCategory[] = ['Champion', 'Eagle'];

const formSchema = z.object({
  name: z.string().min(1, 'Sponsor name is required'),
  category: z.enum(['Champion', 'Eagle'] as const),
  year: z.number().int().min(2024).max(2100),
  website: z.string().url().optional(),
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      year: new Date().getFullYear(),
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
        throw new Error('Upload failed');
      }

      toast.success('Sponsor added successfully!');
      // Reset form and close dialog
      form.reset();
      setFile(null);
      // Find and click the close button
      const closeButton = document.querySelector('[data-dialog-close]') as HTMLButtonElement;
      if (closeButton) closeButton.click();
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
                <Input placeholder="Enter sponsor name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {sponsorCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
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

        <div className="space-y-4">
          <FormLabel>Logo</FormLabel>
          <DropZone
            onFileSelect={setFile}
            disabled={isUploading}
          />
          {file && (
            <ImagePreview
              file={file}
              onRemove={() => setFile(null)}
            />
          )}
        </div>

        <div className="flex justify-end gap-4 pt-4">
          <DialogClose asChild>
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </DialogClose>
          <Button
            type="submit"
            disabled={isUploading}
          >
            {isUploading ? 'Uploading...' : 'Add Sponsor'}
          </Button>
        </div>
      </form>
    </Form>
  );
}
