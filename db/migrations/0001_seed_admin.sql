-- Seed first admin: admin@alabsglobalconcept.com / Admin123 (bcrypt cost 12)
-- Change the password after first login.
INSERT INTO "admins" ("email", "password_hash", "name", "role")
VALUES (
  'admin@alabsglobalconcept.com',
  '$2a$12$KD7mkTknkrmfpuQnT4cmEOrnVdx3spUymzhEANpn0CWY0SIU1EwoW',
  'Site Admin',
  'admin'
)
ON CONFLICT ("email") DO NOTHING;
