CREATE TABLE patient_dependents (
id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

-- Titular do plano familiar
holder_id UUID NOT NULL
REFERENCES patients(id) ON DELETE CASCADE,

-- Conta Patient do dependente (null até convite aceito ou conta criada)
dependent_patient_id UUID NULL
REFERENCES patients(id) ON DELETE SET NULL,

-- Tipo de acesso
has_app_access BOOLEAN NOT NULL DEFAULT FALSE,

-- Dados do dependente
name VARCHAR NULL,
birthdate VARCHAR NULL,
cpf VARCHAR NULL,
email VARCHAR NULL, // email para convite (nulo se sem acesso)

-- Convite (usado apenas quando has_app_access = TRUE)
invite_token VARCHAR NULL,
invite_expires_at TIMESTAMP NULL,

-- Status do vínculo
status VARCHAR(15) NOT NULL DEFAULT 'pending',
-- 'pending' | 'active' | 'removed'

created_at TIMESTAMP NOT NULL DEFAULT now(),
updated_at TIMESTAMP NOT NULL DEFAULT now(),
deleted_at TIMESTAMP NULL
);

CREATE INDEX idx_pd_holder ON patient_dependents(holder_id);
CREATE INDEX idx_pd_patient ON patient_dependents(dependent_patient_id);
CREATE INDEX idx_pd_token ON patient_dependents(invite_token) WHERE invite_token IS NOT NULL;

-- Impede o titular de convidar o mesmo email duas vezes
CREATE UNIQUE INDEX idx_pd_unique_invite
ON patient_dependents(holder_id, email)
WHERE deleted_at IS NULL AND email IS NOT NULL;
