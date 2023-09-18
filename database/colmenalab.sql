--
-- PostgreSQL database dump
--

-- Dumped from database version 14.9 (Ubuntu 14.9-1.pgdg22.04+1)
-- Dumped by pg_dump version 15.4 (Ubuntu 15.4-1.pgdg22.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

--
-- Name: uuid-ossp; Type: EXTENSION; Schema: -; Owner: -
--

CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA public;


--
-- Name: EXTENSION "uuid-ossp"; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION "uuid-ossp" IS 'generate universally unique identifiers (UUIDs)';


--
-- Name: appointments_status_enum; Type: TYPE; Schema: public; Owner: postgres
--

CREATE TYPE public.appointments_status_enum AS ENUM (
    '0',
    '1',
    '2'
);


ALTER TYPE public.appointments_status_enum OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: appointments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.appointments (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "patientId" uuid NOT NULL,
    "doctorId" uuid NOT NULL,
    date date NOT NULL,
    "scheduleId" uuid NOT NULL,
    status public.appointments_status_enum DEFAULT '0'::public.appointments_status_enum NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "deletedAt" timestamp without time zone
);


ALTER TABLE public.appointments OWNER TO postgres;

--
-- Name: diseases; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.diseases (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "deletedAt" timestamp without time zone
);


ALTER TABLE public.diseases OWNER TO postgres;

--
-- Name: diseasetomedicine; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.diseasetomedicine (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "diseaseId" uuid NOT NULL,
    "medicineId" uuid NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "deletedAt" timestamp without time zone
);


ALTER TABLE public.diseasetomedicine OWNER TO postgres;

--
-- Name: doctors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.doctors (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    identification character varying(20) NOT NULL,
    firstname character varying(90) NOT NULL,
    lastname character varying(90) NOT NULL,
    email character varying(200) NOT NULL,
    phone character varying(20) NOT NULL,
    address character varying(200) NOT NULL,
    city character varying(90) NOT NULL,
    "profesionalCard" character varying(90) NOT NULL,
    "contractingDate" timestamp with time zone NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "deletedAt" timestamp without time zone
);


ALTER TABLE public.doctors OWNER TO postgres;

--
-- Name: medicines; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.medicines (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "deletedAt" timestamp without time zone
);


ALTER TABLE public.medicines OWNER TO postgres;

--
-- Name: migrations; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.migrations (
    id integer NOT NULL,
    "timestamp" bigint NOT NULL,
    name character varying NOT NULL
);


ALTER TABLE public.migrations OWNER TO postgres;

--
-- Name: migrations_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.migrations_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.migrations_id_seq OWNER TO postgres;

--
-- Name: migrations_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.migrations_id_seq OWNED BY public.migrations.id;


--
-- Name: orders; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.orders (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "deletedAt" timestamp without time zone,
    description character varying NOT NULL,
    expiration date NOT NULL,
    "specialtyId" uuid NOT NULL,
    "appointmentId" uuid NOT NULL
);


ALTER TABLE public.orders OWNER TO postgres;

--
-- Name: ordertomedicine; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.ordertomedicine (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "orderId" uuid NOT NULL,
    "medicineId" uuid NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "deletedAt" timestamp without time zone
);


ALTER TABLE public.ordertomedicine OWNER TO postgres;

--
-- Name: patients; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.patients (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    identification character varying(20) NOT NULL,
    firstname character varying(90) NOT NULL,
    lastname character varying(90) NOT NULL,
    email character varying(200) NOT NULL,
    phone character varying(20) NOT NULL,
    address character varying(200) NOT NULL,
    city character varying(90) NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "deletedAt" timestamp without time zone
);


ALTER TABLE public.patients OWNER TO postgres;

--
-- Name: schedules; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.schedules (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    "from" time without time zone NOT NULL,
    "to" time without time zone NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "deletedAt" timestamp without time zone
);


ALTER TABLE public.schedules OWNER TO postgres;

--
-- Name: specialties; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.specialties (
    id uuid DEFAULT public.uuid_generate_v4() NOT NULL,
    name character varying NOT NULL,
    "createdAt" timestamp without time zone DEFAULT now() NOT NULL,
    "updatedAt" timestamp without time zone DEFAULT now() NOT NULL,
    "deletedAt" timestamp without time zone
);


ALTER TABLE public.specialties OWNER TO postgres;

--
-- Name: migrations id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations ALTER COLUMN id SET DEFAULT nextval('public.migrations_id_seq'::regclass);


--
-- Data for Name: appointments; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.appointments (id, "patientId", "doctorId", date, "scheduleId", status, "createdAt", "updatedAt", "deletedAt") FROM stdin;
\.


--
-- Data for Name: diseases; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.diseases (id, name, "createdAt", "updatedAt", "deletedAt") FROM stdin;
\.


--
-- Data for Name: diseasetomedicine; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.diseasetomedicine (id, "diseaseId", "medicineId", "createdAt", "updatedAt", "deletedAt") FROM stdin;
\.


--
-- Data for Name: doctors; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.doctors (id, identification, firstname, lastname, email, phone, address, city, "profesionalCard", "contractingDate", "createdAt", "updatedAt", "deletedAt") FROM stdin;
\.


--
-- Data for Name: medicines; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.medicines (id, name, "createdAt", "updatedAt", "deletedAt") FROM stdin;
\.


--
-- Data for Name: migrations; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.migrations (id, "timestamp", name) FROM stdin;
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.orders (id, "createdAt", "updatedAt", "deletedAt", description, expiration, "specialtyId", "appointmentId") FROM stdin;
\.


--
-- Data for Name: ordertomedicine; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.ordertomedicine (id, "orderId", "medicineId", "createdAt", "updatedAt", "deletedAt") FROM stdin;
\.


--
-- Data for Name: patients; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.patients (id, identification, firstname, lastname, email, phone, address, city, "createdAt", "updatedAt", "deletedAt") FROM stdin;
\.


--
-- Data for Name: schedules; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.schedules (id, "from", "to", "createdAt", "updatedAt", "deletedAt") FROM stdin;
3983c31c-1db8-447c-81c2-36db55d06938	08:20:00	08:40:00	2023-09-16 03:14:43.094564	2023-09-16 03:14:43.094564	\N
a96dbdc1-bc3f-4b6a-970b-2dcfa67c7b73	08:40:00	09:00:00	2023-09-16 03:14:43.094564	2023-09-16 03:14:43.094564	\N
67984d22-be07-4919-a8b6-e8b8dd61df67	09:00:00	09:20:00	2023-09-16 03:14:43.094564	2023-09-16 03:14:43.094564	\N
6d6dcfc1-3207-4d20-a53e-a46710c07bf7	09:20:00	09:40:00	2023-09-16 03:14:43.094564	2023-09-16 03:14:43.094564	\N
4ad57102-5369-42dc-874d-5c17ce60e006	09:40:00	10:00:00	2023-09-16 03:14:43.094564	2023-09-16 03:14:43.094564	\N
d17f3266-be23-4ffe-8785-1eb9c153d449	10:00:00	10:20:00	2023-09-16 03:14:43.094564	2023-09-16 03:14:43.094564	\N
0b9dae6d-3e23-4623-a2ba-084a48ea4227	10:20:00	10:40:00	2023-09-16 03:14:43.094564	2023-09-16 03:14:43.094564	\N
2826e3df-214c-4892-b8a8-3fb949273866	10:40:00	11:00:00	2023-09-16 03:14:43.094564	2023-09-16 03:14:43.094564	\N
05fc4452-d50f-4937-aa31-d719c6278528	11:00:00	11:20:00	2023-09-16 03:14:43.094564	2023-09-16 03:14:43.094564	\N
ef3a82bd-a4ed-4b09-b651-f9ce5da0b651	11:20:00	11:40:00	2023-09-16 03:14:43.094564	2023-09-16 03:14:43.094564	\N
6253f4a8-fe1c-4db6-b01f-2d9059c54170	11:40:00	12:00:00	2023-09-16 03:14:43.094564	2023-09-16 03:14:43.094564	\N
293324a7-2b32-40ee-b20f-32cbd2380537	08:00:00	08:20:00	2023-09-16 03:14:43.094564	2023-09-16 03:14:43.094564	\N
\.


--
-- Data for Name: specialties; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.specialties (id, name, "createdAt", "updatedAt", "deletedAt") FROM stdin;
\.


--
-- Name: migrations_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.migrations_id_seq', 1, false);


--
-- Name: diseasetomedicine PK_307ac3985989bffb2ddae93af45; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.diseasetomedicine
    ADD CONSTRAINT "PK_307ac3985989bffb2ddae93af45" PRIMARY KEY (id);


--
-- Name: appointments PK_4a437a9a27e948726b8bb3e36ad; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT "PK_4a437a9a27e948726b8bb3e36ad" PRIMARY KEY (id);


--
-- Name: orders PK_710e2d4957aa5878dfe94e4ac2f; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT "PK_710e2d4957aa5878dfe94e4ac2f" PRIMARY KEY (id);


--
-- Name: medicines PK_77b93851766f7ab93f71f44b18b; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT "PK_77b93851766f7ab93f71f44b18b" PRIMARY KEY (id);


--
-- Name: diseases PK_79ddc936b1458d8a079b62dc210; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.diseases
    ADD CONSTRAINT "PK_79ddc936b1458d8a079b62dc210" PRIMARY KEY (id);


--
-- Name: schedules PK_7e33fc2ea755a5765e3564e66dd; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedules
    ADD CONSTRAINT "PK_7e33fc2ea755a5765e3564e66dd" PRIMARY KEY (id);


--
-- Name: doctors PK_8207e7889b50ee3695c2b8154ff; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctors
    ADD CONSTRAINT "PK_8207e7889b50ee3695c2b8154ff" PRIMARY KEY (id);


--
-- Name: ordertomedicine PK_871e8185227ee11173728fc1f68; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ordertomedicine
    ADD CONSTRAINT "PK_871e8185227ee11173728fc1f68" PRIMARY KEY (id);


--
-- Name: migrations PK_8c82d7f526340ab734260ea46be; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.migrations
    ADD CONSTRAINT "PK_8c82d7f526340ab734260ea46be" PRIMARY KEY (id);


--
-- Name: patients PK_a7f0b9fcbb3469d5ec0b0aceaa7; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patients
    ADD CONSTRAINT "PK_a7f0b9fcbb3469d5ec0b0aceaa7" PRIMARY KEY (id);


--
-- Name: specialties PK_ba01cec5aa8ac48778a1d097e98; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.specialties
    ADD CONSTRAINT "PK_ba01cec5aa8ac48778a1d097e98" PRIMARY KEY (id);


--
-- Name: medicines UQ_07f8fe9649327c6cffe35c5849b; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.medicines
    ADD CONSTRAINT "UQ_07f8fe9649327c6cffe35c5849b" UNIQUE (name);


--
-- Name: diseases UQ_293ca0c5bba4f9950f3fb976d33; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.diseases
    ADD CONSTRAINT "UQ_293ca0c5bba4f9950f3fb976d33" UNIQUE (name);


--
-- Name: appointments UQ_42fcbd6c5688295b241f1f20989; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT "UQ_42fcbd6c5688295b241f1f20989" UNIQUE ("doctorId", date, "scheduleId");


--
-- Name: specialties UQ_565f38f8b0417c7dbd40e429782; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.specialties
    ADD CONSTRAINT "UQ_565f38f8b0417c7dbd40e429782" UNIQUE (name);


--
-- Name: appointments UQ_c32479b127b2d84e3ad40a9e4fc; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT "UQ_c32479b127b2d84e3ad40a9e4fc" UNIQUE ("patientId", date, "scheduleId");


--
-- Name: doctors UQ_ce42c5538a8f40dc0354bdd2252; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.doctors
    ADD CONSTRAINT "UQ_ce42c5538a8f40dc0354bdd2252" UNIQUE (identification);


--
-- Name: patients UQ_cec97f88aeeaaa14b45f078370f; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.patients
    ADD CONSTRAINT "UQ_cec97f88aeeaaa14b45f078370f" UNIQUE (identification);


--
-- Name: diseasetomedicine FK_01715d1ec793c04013fe01fb842; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.diseasetomedicine
    ADD CONSTRAINT "FK_01715d1ec793c04013fe01fb842" FOREIGN KEY ("medicineId") REFERENCES public.medicines(id);


--
-- Name: appointments FK_04cf50744c7223e8a3db28e7f9b; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT "FK_04cf50744c7223e8a3db28e7f9b" FOREIGN KEY ("scheduleId") REFERENCES public.schedules(id);


--
-- Name: appointments FK_0c1af27b469cb8dca420c160d65; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT "FK_0c1af27b469cb8dca420c160d65" FOREIGN KEY ("doctorId") REFERENCES public.doctors(id);


--
-- Name: appointments FK_13c2e57cb81b44f062ba24df57d; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.appointments
    ADD CONSTRAINT "FK_13c2e57cb81b44f062ba24df57d" FOREIGN KEY ("patientId") REFERENCES public.patients(id);


--
-- Name: ordertomedicine FK_29d1c16a86275a3b43b6e420d28; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ordertomedicine
    ADD CONSTRAINT "FK_29d1c16a86275a3b43b6e420d28" FOREIGN KEY ("medicineId") REFERENCES public.medicines(id);


--
-- Name: orders FK_2b26e72d04e334d3e5ae0303e6a; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT "FK_2b26e72d04e334d3e5ae0303e6a" FOREIGN KEY ("specialtyId") REFERENCES public.specialties(id);


--
-- Name: orders FK_4a9f339606093cda209e00f4035; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT "FK_4a9f339606093cda209e00f4035" FOREIGN KEY ("appointmentId") REFERENCES public.appointments(id);


--
-- Name: ordertomedicine FK_589da9c138f527bcaf571daba48; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.ordertomedicine
    ADD CONSTRAINT "FK_589da9c138f527bcaf571daba48" FOREIGN KEY ("orderId") REFERENCES public.orders(id);


--
-- Name: diseasetomedicine FK_5adb966a42e43c0803c17cad497; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.diseasetomedicine
    ADD CONSTRAINT "FK_5adb966a42e43c0803c17cad497" FOREIGN KEY ("diseaseId") REFERENCES public.diseases(id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

