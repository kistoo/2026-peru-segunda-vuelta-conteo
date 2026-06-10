# ONPE 2026 — Resultados Segunda Vuelta Presidencial

Proyecto fullstack para visualizar en tiempo real los resultados del API oficial de ONPE.
Desarrollado como portfolio / CV showcasing React, TypeScript, NestJS y Docker.

---

## Stack tecnológico

| Capa | Tecnología |
|---|---|
| **Frontend** | React 18 · TypeScript 5 · Vite · Tailwind CSS |
| **Backend** | NestJS · TypeScript · `@nestjs/axios` |
| **Adaptador API** | Python 3 · `curl_cffi` (TLS fingerprint spoofing) |
| **Infraestructura** | Docker · docker-compose · nginx |

---

## Estructura del proyecto

```
onpe/
├── frontend/               # React + Vite + Tailwind
│   ├── src/
│   │   ├── components/     # Navbar, HeaderBand, CandidatesGrid, JeeSection…
│   │   ├── hooks/          # useResultados (fetch + auto-refresh)
│   │   ├── types/          # Interfaces TypeScript compartidas
│   │   ├── lib/            # Utilidades (format.ts)
│   │   └── App.tsx
│   ├── Dockerfile
│   └── nginx.conf
├── backend/                # NestJS REST API
│   ├── src/
│   │   └── resultados/
│   │       ├── resultados.controller.ts   # GET /resultados
│   │       ├── resultados.service.ts      # Caché + fetch + fallback Python
│   │       ├── onpe-fetcher.py            # Adaptador Python (curl_cffi)
│   │       └── dto/resultados.dto.ts      # DTOs TypeScript
│   └── Dockerfile
├── docker-compose.yml
└── README.md
```

---

## Desarrollo local

### Prerequisitos
- Node.js 22+
- Python 3.10+ con `curl_cffi` instalado
- Docker Desktop (solo para producción)

### 1. Backend (NestJS)

```powershell
cd backend
npm install
# Configurar ruta de Python en .env:
# PYTHON_BIN=C:\Users\...\python.exe
npm run start:dev
# → http://localhost:3000/resultados
```

### 2. Frontend (React)

```powershell
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

---

## Producción con Docker

```bash
# Construir y levantar todos los servicios
docker-compose up --build

# Frontend → http://localhost
# Backend  → http://localhost:3000
```

---

## Arquitectura

```
Browser (React + TS)
  └─ fetch /resultados cada 2 min
       └─ NestJS Controller  GET /resultados
            └─ ResultadosService
                 ├─ Cache in-memory (120s TTL)
                 ├─ axios → ONPE API  [intento 1]
                 │    └─ Si responde HTML (TLS fingerprint)↓
                 └─ child_process → onpe-fetcher.py  [fallback]
                      └─ curl_cffi impersonate="chrome124"
                           └─ ONPE API → JSON ✓
```

### ¿Por qué el adaptador Python?

El servidor de ONPE usa **TLS fingerprinting** (técnica JA3): distingue clientes
por la firma del handshake TLS, no solo por los headers HTTP. Node.js tiene un
fingerprint diferente al de Chrome, por lo que responde con HTML en lugar de JSON.

La librería `curl_cffi` replica el handshake TLS completo de Chrome 124, permitiendo
obtener la respuesta JSON correcta. El servicio NestJS intenta primero con `axios`
y cae al adaptador Python solo cuando es necesario.

---

## API del Backend

### `GET /resultados`

Devuelve el resumen completo de resultados.

**Respuesta:**
```json
{
  "ts": "10/06/2026 13:00:00",
  "cache_ttl": 120,
  "oficiales": {
    "keiko_votos": 9006906,
    "keiko_pct": 49.984,
    "sanchez_votos": 9012677,
    "sanchez_pct": 50.016,
    "diff": -5771
  },
  "jee": {
    "actas_jee": 1613,
    "actas_pend": 406,
    "keiko_jee": 184971,
    "sanchez_jee": 137313
  },
  "proyeccion": { "..." },
  "pendientes": { "..." }
}
```

---

## API de ONPE descubierta

| Endpoint | Descripción |
|---|---|
| `GET /presentacion-backend/eleccion-presidencial/participantes-ubicacion-geografica` | Totales oficiales por candidato |
| `GET /presentacion-backend/actas` | Lista paginada de actas (máx. 100/pág.) |
| `GET /presentacion-backend/actas/buscar/mesa?codigoMesa=XXX` | Votos por mesa específica |
| `GET /presentacion-backend/ubigeos/departamentos` | Lista de departamentos |

---

## Scripts Python (análisis)

| Script | Descripción |
|---|---|
| `onpe_votos_jee.py` | Suma votos en las ~1,613 actas enviadas al JEE |
| `onpe_actas_pendientes.py` | Cuenta actas por estado (C/E/P) en todo el país |
| `resumen_rapido.py` | Resumen rápido con datos precalculados |

```powershell
pip install curl_cffi pandas
python onpe_votos_jee.py
```

---

## Resultados al 10/06/2026

| Escenario | Keiko Fujimori (FP) | Roberto Sánchez (JPP) | Diferencia |
|---|---|---|---|
| Oficial (90,747 actas C) | 9,006,906 · 49.984% | 9,012,677 · 50.016% | −5,771 (Sánchez) |
| Actas JEE (1,613 actas E) | +184,971 · 57.39% | +137,313 · 42.61% | +47,658 (Keiko) |
| **Proyección C+E** | **9,191,877 · 50.12%** | **9,149,990 · 49.88%** | **+41,887 (Keiko)** |
| Pendientes est. (406) | ~+40,184 | ~+40,203 | ~empate |
