ALTER TABLE plans
ADD COLUMN type VARCHAR(20) NOT NULL DEFAULT 'individual',
ADD COLUMN max_dependents INT NOT NULL DEFAULT 0;

UPDATE plans SET type = 'individual', max_dependents = 0;

COMMENT ON COLUMN plans.type IS 'individual | family';
COMMENT ON COLUMN plans.max_dependents IS '0 para individual, N para familiar (3, 5, etc)';
