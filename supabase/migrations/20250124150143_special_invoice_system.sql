-- Location: supabase/migrations/20250124150143_special_invoice_system.sql
-- Schema Analysis: Creating new special invoice system for Skupadi
-- Integration Type: addition/extension
-- Dependencies: Creates new tables for special invoice functionality

-- 1. Types for Special Invoice System
CREATE TYPE public.service_type AS ENUM (
    'transportation',
    'accommodation', 
    'hostel',
    'excursion',
    'pta_levy',
    'computer_fee',
    'laboratory_fee',
    'sports_fee',
    'library_fee',
    'uniform',
    'books',
    'examination_fee',
    'other'
);

CREATE TYPE public.invoice_scope AS ENUM (
    'entire_school',
    'class',
    'subclass', 
    'selected_students'
);

CREATE TYPE public.invoice_status AS ENUM (
    'pending',
    'paid',
    'overdue',
    'cancelled',
    'draft'
);

CREATE TYPE public.user_role AS ENUM (
    'admin',
    'finance_admin',
    'teacher',
    'student',
    'parent'
);

-- 2. Core Tables

-- User profiles table (authentication bridge)
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role public.user_role DEFAULT 'admin'::public.user_role,
    phone TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- School classes table
CREATE TABLE public.school_classes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL UNIQUE, -- e.g., "JSS 1", "SS 2"
    grade_level TEXT NOT NULL, -- e.g., "JSS", "SS"
    has_subclasses BOOLEAN DEFAULT false,
    capacity INTEGER DEFAULT 30,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Subclasses table
CREATE TABLE public.subclasses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    class_id UUID REFERENCES public.school_classes(id) ON DELETE CASCADE,
    name TEXT NOT NULL, -- e.g., "JSS 1A", "SS 2 Science"
    description TEXT,
    capacity INTEGER DEFAULT 30,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(class_id, name)
);

-- Students table
CREATE TABLE public.students (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id TEXT NOT NULL UNIQUE,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    class_id UUID REFERENCES public.school_classes(id) ON DELETE SET NULL,
    subclass_id UUID REFERENCES public.subclasses(id) ON DELETE SET NULL,
    date_of_birth DATE,
    address TEXT,
    parent_name TEXT,
    parent_phone TEXT,
    parent_email TEXT,
    admission_date DATE DEFAULT CURRENT_DATE,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES public.user_profiles(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Student billable items configuration
CREATE TABLE public.student_billable_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    service_type public.service_type NOT NULL,
    is_active BOOLEAN DEFAULT false,
    custom_amount DECIMAL(10,2), -- Override default amount if needed
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(student_id, service_type)
);

-- Invoices table (enhanced with service_type)
CREATE TABLE public.invoices (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    invoice_number TEXT NOT NULL UNIQUE,
    student_id UUID REFERENCES public.students(id) ON DELETE CASCADE,
    service_type public.service_type, -- NULL for regular invoices, specific for special invoices
    amount DECIMAL(10,2) NOT NULL,
    due_date DATE NOT NULL,
    issue_date DATE DEFAULT CURRENT_DATE,
    term TEXT, -- e.g., "2024/2025 First Term"
    academic_year TEXT DEFAULT '2024/2025',
    status public.invoice_status DEFAULT 'pending'::public.invoice_status,
    description TEXT,
    notes TEXT,
    payment_date DATE,
    created_by UUID REFERENCES public.user_profiles(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Special invoice generations audit log
CREATE TABLE public.special_invoice_generations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_type public.service_type NOT NULL,
    scope public.invoice_scope NOT NULL,
    target_class_id UUID REFERENCES public.school_classes(id),
    target_subclass_id UUID REFERENCES public.subclasses(id),
    selected_student_ids UUID[], -- For selected students scope
    total_students_affected INTEGER NOT NULL,
    total_amount DECIMAL(12,2) NOT NULL,
    due_date DATE NOT NULL,
    term TEXT,
    notes TEXT,
    created_by UUID REFERENCES public.user_profiles(id),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- Service type configurations
CREATE TABLE public.service_configurations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_type public.service_type NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    default_amount DECIMAL(10,2) NOT NULL,
    is_available_for_all_classes BOOLEAN DEFAULT true,
    applicable_class_ids UUID[], -- NULL means all classes
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

-- 3. Essential Indexes
CREATE INDEX idx_user_profiles_email ON public.user_profiles(email);
CREATE INDEX idx_user_profiles_role ON public.user_profiles(role);
CREATE INDEX idx_school_classes_grade_level ON public.school_classes(grade_level);
CREATE INDEX idx_subclasses_class_id ON public.subclasses(class_id);
CREATE INDEX idx_students_class_id ON public.students(class_id);
CREATE INDEX idx_students_subclass_id ON public.students(subclass_id);
CREATE INDEX idx_students_student_id ON public.students(student_id);
CREATE INDEX idx_student_billable_items_student_id ON public.student_billable_items(student_id);
CREATE INDEX idx_student_billable_items_service_type ON public.student_billable_items(service_type);
CREATE INDEX idx_invoices_student_id ON public.invoices(student_id);
CREATE INDEX idx_invoices_service_type ON public.invoices(service_type);
CREATE INDEX idx_invoices_status ON public.invoices(status);
CREATE INDEX idx_invoices_due_date ON public.invoices(due_date);
CREATE INDEX idx_invoices_term_service ON public.invoices(term, service_type);
CREATE INDEX idx_special_invoice_generations_service_type ON public.special_invoice_generations(service_type);
CREATE INDEX idx_special_invoice_generations_created_by ON public.special_invoice_generations(created_by);
CREATE INDEX idx_service_configurations_service_type ON public.service_configurations(service_type);

-- Unique constraint to prevent duplicate special invoices
CREATE UNIQUE INDEX idx_unique_special_invoice 
ON public.invoices (student_id, service_type, term) 
WHERE service_type IS NOT NULL;

-- 4. Functions (MUST BE BEFORE RLS POLICIES)

-- Function to get eligible students for special invoice
CREATE OR REPLACE FUNCTION public.get_eligible_students_for_service(
    p_service_type public.service_type,
    p_scope public.invoice_scope,
    p_class_id UUID DEFAULT NULL,
    p_subclass_id UUID DEFAULT NULL,
    p_selected_student_ids UUID[] DEFAULT NULL
)
RETURNS TABLE(
    student_id UUID,
    student_name TEXT,
    class_name TEXT,
    subclass_name TEXT,
    has_billable_item BOOLEAN,
    custom_amount DECIMAL(10,2)
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    RETURN QUERY
    SELECT 
        s.id,
        CONCAT(s.first_name, ' ', s.last_name),
        sc.name,
        sub.name,
        (sbi.id IS NOT NULL AND sbi.is_active = true),
        sbi.custom_amount
    FROM public.students s
    LEFT JOIN public.school_classes sc ON s.class_id = sc.id
    LEFT JOIN public.subclasses sub ON s.subclass_id = sub.id
    LEFT JOIN public.student_billable_items sbi ON s.id = sbi.student_id 
        AND sbi.service_type = p_service_type
    WHERE s.is_active = true
        AND (
            (p_scope = 'entire_school') OR
            (p_scope = 'class' AND s.class_id = p_class_id) OR
            (p_scope = 'subclass' AND s.subclass_id = p_subclass_id) OR
            (p_scope = 'selected_students' AND s.id = ANY(p_selected_student_ids))
        )
        AND (sbi.id IS NULL OR sbi.is_active = true); -- Only include students with active billable items or no configuration
END;
$$;

-- Function to create special invoices in bulk
CREATE OR REPLACE FUNCTION public.create_special_invoices_bulk(
    p_service_type public.service_type,
    p_scope public.invoice_scope,
    p_class_id UUID DEFAULT NULL,
    p_subclass_id UUID DEFAULT NULL,
    p_selected_student_ids UUID[] DEFAULT NULL,
    p_default_amount DECIMAL(10,2),
    p_due_date DATE,
    p_term TEXT DEFAULT '2024/2025 First Term',
    p_notes TEXT DEFAULT NULL,
    p_created_by UUID
)
RETURNS TABLE(
    success BOOLEAN,
    invoices_created INTEGER,
    total_amount DECIMAL(12,2),
    generation_id UUID
)
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_generation_id UUID := gen_random_uuid();
    v_invoices_created INTEGER := 0;
    v_total_amount DECIMAL(12,2) := 0;
    v_student_record RECORD;
    v_invoice_amount DECIMAL(10,2);
    v_invoice_number TEXT;
    v_invoice_count INTEGER := 0;
BEGIN
    -- Get current invoice count for numbering
    SELECT COUNT(*) INTO v_invoice_count FROM public.invoices 
    WHERE invoice_number LIKE 'SPV-' || TO_CHAR(NOW(), 'YYYYMM') || '-%';
    
    -- Create invoices for eligible students
    FOR v_student_record IN 
        SELECT * FROM public.get_eligible_students_for_service(
            p_service_type, p_scope, p_class_id, p_subclass_id, p_selected_student_ids
        )
    LOOP
        -- Skip if student already has an invoice for this service and term
        IF EXISTS (
            SELECT 1 FROM public.invoices 
            WHERE student_id = v_student_record.student_id 
            AND service_type = p_service_type 
            AND term = p_term
        ) THEN
            CONTINUE;
        END IF;
        
        -- Determine invoice amount (custom amount or default)
        v_invoice_amount := COALESCE(v_student_record.custom_amount, p_default_amount);
        
        -- Generate invoice number
        v_invoice_count := v_invoice_count + 1;
        v_invoice_number := 'SPV-' || TO_CHAR(NOW(), 'YYYYMM') || '-' || LPAD(v_invoice_count::TEXT, 3, '0');
        
        -- Create invoice
        INSERT INTO public.invoices (
            invoice_number, student_id, service_type, amount, due_date,
            term, description, notes, created_by
        ) VALUES (
            v_invoice_number,
            v_student_record.student_id,
            p_service_type,
            v_invoice_amount,
            p_due_date,
            p_term,
            'Special Invoice: ' || p_service_type::TEXT,
            p_notes,
            p_created_by
        );
        
        v_invoices_created := v_invoices_created + 1;
        v_total_amount := v_total_amount + v_invoice_amount;
    END LOOP;
    
    -- Log the generation
    INSERT INTO public.special_invoice_generations (
        id, service_type, scope, target_class_id, target_subclass_id,
        selected_student_ids, total_students_affected, total_amount,
        due_date, term, notes, created_by
    ) VALUES (
        v_generation_id, p_service_type, p_scope, p_class_id, p_subclass_id,
        p_selected_student_ids, v_invoices_created, v_total_amount,
        p_due_date, p_term, p_notes, p_created_by
    );
    
    RETURN QUERY SELECT true, v_invoices_created, v_total_amount, v_generation_id;
END;
$$;

-- Function for automatic profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
SECURITY DEFINER
LANGUAGE plpgsql
AS $$
BEGIN
    INSERT INTO public.user_profiles (id, email, full_name, role)
    VALUES (
        NEW.id, 
        NEW.email, 
        COALESCE(NEW.raw_user_meta_data->>'full_name', split_part(NEW.email, '@', 1)),
        COALESCE(NEW.raw_user_meta_data->>'role', 'admin')::public.user_role
    );
    RETURN NEW;
END;
$$;

-- 5. Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subclasses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.students ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.student_billable_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.special_invoice_generations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_configurations ENABLE ROW LEVEL SECURITY;

-- 6. RLS Policies

-- User profiles policies (Pattern 1 - Core user table)
CREATE POLICY "users_manage_own_user_profiles"
ON public.user_profiles
FOR ALL
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- School classes policies (Pattern 4 - Public read, admin write)
CREATE POLICY "public_can_read_school_classes"
ON public.school_classes
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "admins_manage_school_classes"
ON public.school_classes
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles up
        WHERE up.id = auth.uid() 
        AND up.role IN ('admin', 'finance_admin')
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_profiles up
        WHERE up.id = auth.uid() 
        AND up.role IN ('admin', 'finance_admin')
    )
);

-- Subclasses policies
CREATE POLICY "public_can_read_subclasses"
ON public.subclasses
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "admins_manage_subclasses"
ON public.subclasses
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles up
        WHERE up.id = auth.uid() 
        AND up.role IN ('admin', 'finance_admin')
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_profiles up
        WHERE up.id = auth.uid() 
        AND up.role IN ('admin', 'finance_admin')
    )
);

-- Students policies
CREATE POLICY "authenticated_can_read_students"
ON public.students
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "admins_manage_students"
ON public.students
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles up
        WHERE up.id = auth.uid() 
        AND up.role IN ('admin', 'finance_admin', 'teacher')
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_profiles up
        WHERE up.id = auth.uid() 
        AND up.role IN ('admin', 'finance_admin', 'teacher')
    )
);

-- Student billable items policies
CREATE POLICY "authenticated_can_read_student_billable_items"
ON public.student_billable_items
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "admins_manage_student_billable_items"
ON public.student_billable_items
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles up
        WHERE up.id = auth.uid() 
        AND up.role IN ('admin', 'finance_admin')
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_profiles up
        WHERE up.id = auth.uid() 
        AND up.role IN ('admin', 'finance_admin')
    )
);

-- Invoices policies
CREATE POLICY "authenticated_can_read_invoices"
ON public.invoices
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "finance_staff_manage_invoices"
ON public.invoices
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles up
        WHERE up.id = auth.uid() 
        AND up.role IN ('admin', 'finance_admin')
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_profiles up
        WHERE up.id = auth.uid() 
        AND up.role IN ('admin', 'finance_admin')
    )
);

-- Special invoice generations policies
CREATE POLICY "finance_staff_manage_special_invoice_generations"
ON public.special_invoice_generations
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles up
        WHERE up.id = auth.uid() 
        AND up.role IN ('admin', 'finance_admin')
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_profiles up
        WHERE up.id = auth.uid() 
        AND up.role IN ('admin', 'finance_admin')
    )
);

-- Service configurations policies
CREATE POLICY "authenticated_can_read_service_configurations"
ON public.service_configurations
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "admins_manage_service_configurations"
ON public.service_configurations
FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.user_profiles up
        WHERE up.id = auth.uid() 
        AND up.role IN ('admin', 'finance_admin')
    )
)
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.user_profiles up
        WHERE up.id = auth.uid() 
        AND up.role IN ('admin', 'finance_admin')
    )
);

-- 7. Triggers
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 8. Initial Data

-- Insert service configurations
DO $$
BEGIN
    INSERT INTO public.service_configurations (service_type, name, description, default_amount) VALUES
        ('transportation', 'Transportation', 'School bus service', 6000.00),
        ('accommodation', 'Accommodation', 'Student boarding facilities', 25000.00),
        ('hostel', 'Hostel Fee', 'Boarding and lodging services', 25000.00),
        ('excursion', 'Educational Excursion', 'Field trips and educational tours', 5000.00),
        ('pta_levy', 'PTA Levy', 'Parent-Teacher Association levy', 1000.00),
        ('computer_fee', 'Computer Fee', 'Computer lab access and ICT training', 3500.00),
        ('laboratory_fee', 'Laboratory Fee', 'Science laboratory usage and materials', 4000.00),
        ('sports_fee', 'Sports Fee', 'Sports and physical education activities', 2500.00),
        ('library_fee', 'Library Fee', 'Library access and maintenance', 1500.00),
        ('uniform', 'School Uniform', 'Complete school uniform set', 5000.00),
        ('books', 'Text Books', 'Required textbooks for the term', 8000.00),
        ('examination_fee', 'Examination Fee', 'Terminal examination fee', 2500.00),
        ('other', 'Other Services', 'Miscellaneous services', 1000.00);

    -- Insert sample school classes
    INSERT INTO public.school_classes (id, name, grade_level, has_subclasses) VALUES
        (gen_random_uuid(), 'JSS 1', 'JSS', true),
        (gen_random_uuid(), 'JSS 2', 'JSS', true),
        (gen_random_uuid(), 'JSS 3', 'JSS', true),
        (gen_random_uuid(), 'SS 1', 'SS', true),
        (gen_random_uuid(), 'SS 2', 'SS', true),
        (gen_random_uuid(), 'SS 3', 'SS', false);

EXCEPTION
    WHEN unique_violation THEN
        RAISE NOTICE 'Some initial data already exists, skipping...';
    WHEN OTHERS THEN
        RAISE NOTICE 'Error inserting initial data: %', SQLERRM;
END $$;