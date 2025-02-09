-- Update raw_user_meta_data to include role
update auth.users
set raw_user_meta_data = 
  case 
    when email = 'scott@thinkcode.ai' then 
      jsonb_build_object('role', 'admin')
    else 
      jsonb_build_object('role', 'user')
  end
where email in ('scott@thinkcode.ai', 'scottied2@pm.me');
