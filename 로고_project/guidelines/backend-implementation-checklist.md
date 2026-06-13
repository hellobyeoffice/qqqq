# Backend implementation checklist

- OAuth 2.0: enable Google and Kakao providers in Supabase Auth or Firebase Auth.
- Account merge: use normalized email as the unique identity key. If a Kakao and Google login return the same email, attach the provider to the existing user record.
- Roles: store `role` as `USER` or `ADMIN`; gate bulk upload and admin routes on `ADMIN`.
- Storage: upload images to Supabase Storage and store the public URL in `photos.image_url`.
- Encoding: PostgreSQL/Supabase text is UTF-8. If MySQL is used, configure `utf8mb4` and `utf8mb4_unicode_ci`.
- API responses: return `Content-Type: application/json; charset=utf-8`.
- Ranking: calculate score as `likes_count + shares_count * 3`.
