-- Create the user_allergies table
CREATE TABLE public.user_allergies (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  ingredient_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE public.user_allergies IS 'Stores ingredients a user is allergic to.';

-- Enable RLS and define policies for user_allergies
ALTER TABLE public.user_allergies ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own allergies"
ON public.user_allergies
FOR ALL USING (auth.uid() = user_id);

-- Create the user_conditions table
CREATE TABLE public.user_conditions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  condition_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE public.user_conditions IS 'Stores health conditions reported by the user.';

-- Enable RLS and define policies for user_conditions
ALTER TABLE public.user_conditions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own conditions"
ON public.user_conditions
FOR ALL USING (auth.uid() = user_id);

-- Create the user_medications table
CREATE TABLE public.user_medications (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.user_profiles(id) ON DELETE CASCADE,
  medication_name TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
COMMENT ON TABLE public.user_medications IS 'Stores medications the user is taking.';

-- Enable RLS and define policies for user_medications
ALTER TABLE public.user_medications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own medications"
ON public.user_medications
FOR ALL USING (auth.uid() = user_id); 