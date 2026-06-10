"""
Adaptador Python para el API de ONPE.
NestJS lo invoca cuando axios recibe HTML en lugar de JSON
(TLS fingerprinting: el servidor detecta clientes no-Chrome).
Salida: JSON en stdout.
"""
import json, sys
from curl_cffi import requests as R

ONPE = "https://resultadosegundavuelta.onpe.gob.pe/presentacion-backend"
HEADERS = {
    "Accept"  : "application/json, text/plain, */*",
    "Origin"  : "https://resultadosegundavuelta.onpe.gob.pe",
    "Referer" : "https://resultadosegundavuelta.onpe.gob.pe/main/presidenciales",
}

r = R.get(
    f"{ONPE}/eleccion-presidencial/participantes-ubicacion-geografica",
    params={"idEleccion": 10, "tipoFiltro": "eleccion"},
    headers=HEADERS,
    impersonate="chrome124",
    timeout=20,
)
print(json.dumps(r.json(), ensure_ascii=False))
