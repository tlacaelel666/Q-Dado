<img width="770" height="449" alt="ddadocuantico" src="https://github.com/user-attachments/assets/3b8b171f-8009-4226-8bae-20c67ee760dc" />

![Status](https://img.shields.io/badge/Status-Active-brightgreen?style=flat-square)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Google Gemini](https://img.shields.io/badge/Google_Gemini-4285F4?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
[![React](https://img.shields.io/badge/React-19.1.1-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8.2-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-6.2.0-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)](https://www.docker.com/)

![Quantum Computing](https://img.shields.io/badge/Quantum-Computing-FF6B6B?style=flat-square)
![MIT License](https://img.shields.io/badge/License-MIT-green?style=flat-square)

![Contributions](https://img.shields.io/badge/Contributions-Welcome-orange?style=flat-square)

## ✨ Características

Una aplicación web interactiva que simula un sistema cuántico de 3 qubits representado como un dado octaédrico de 8 caras. Cada lanzamiento demuestra conceptos fundamentales de la mecánica cuántica como superposición, entrelazamiento, colapso de función de onda y corrección de errores cuánticos.

### 🔬 Simulación Cuántica Completa
- **Sistema de 3 qubits**: Representado como un dado octaédrico con 8 estados base (|000⟩ a |111⟩)
- **Colapso de función de onda**: Visualización del proceso de medición cuántica
- **Estados entrelazados**: La cara resultante y su opuesta siempre suman 7
- **Hamiltoniano constante**: Conservación de energía (H = 7) en cada lanzamiento

### 🛡️ Corrección de Errores Cuánticos (QEC)
- **Código de repetición**: Usa 3 qubits físicos redundantes
- **Detección automática**: Identifica errores introducidos por ruido ambiental
- **Corrección por mayoría**: Recupera el estado lógico original
- **Visualización en tiempo real**: Muestra el proceso completo de corrección

### 📊 Análisis y Visualización
- **Esfera de Bloch**: Representación 3D del estado cuántico
- **Función de onda**: Gráfico de barras con amplitudes de probabilidad
- **Dinámica cuántica**: Simulación de evolución temporal con decoherencia
- **Estadísticas**: Análisis completo de distribución y tendencias

### 🚀 Características Avanzadas
- **Lanzamientos en lote**: Procesamiento automático de múltiples tiradas
- **Dinámica Hamiltoniana**: Evolución unitaria del sistema
- **Operadores de Lindblad**: Simulación de decoherencia cuántica
- **Interfaz responsiva**: Optimizada para desktop y móvil

## 🛠️ Tecnologías Utilizadas

- **React 19.1.1** - Framework de interfaz de usuario
- **TypeScript 5.8.2** - Tipado estático
- **Vite 6.2.0** - Herramienta de construcción y desarrollo
- **Tailwind CSS** - Framework de estilos utilitarios
- **Recharts 3.2.0** - Librería de gráficos
- **Google Gemini API** - IA generativa para simulación cuántica
- **Docker** - Contenedorización

## 🚀 Instalación y Configuración

### Prerequisitos
- Node.js 20 o superior
- npm o yarn
- Clave API de Google Gemini

### Instalación Local

1. **Clonar el repositorio**
```bash
git clone https://github.com/tlacaelel666/Quantum-Dice-Simulator.git
cd Quantum-Dice-Simulator
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
```bash
# Crear archivo .env en la raíz del proyecto
echo "GEMINI_API_KEY=tu_clave_api_aquí" > .env
```

4. **Ejecutar en modo desarrollo**
```bash
npm run dev
```

5. **Construir para producción**
```bash
npm run build
npm run preview
```

### 🐳 Instalación con Docker

1. **Construir la imagen**
```bash
docker build -t quantum-dice-simulator .
```

2. **Ejecutar el contenedor**
```bash
docker run -p 3000:3000 -e GEMINI_API_KEY=tu_clave_api_aquí quantum-dice-simulator
```

## 🎯 Uso

### Lanzamiento Básico
1. Haz clic en **"Lanzar Dado Cuántico"** para realizar una medición
2. Observa el colapso de la función de onda al estado resultante
3. Analiza las propiedades cuánticas en el panel de detalles

### Corrección de Errores Cuánticos
1. Activa la opción **"Activar Corrección de Errores (QEC)"**
2. Los lanzamientos mostrarán el proceso de detección y corrección
3. Observa cómo el sistema recupera el estado lógico correcto
<img width="710" height="53" alt="dadocorreccion" src="https://github.com/user-attachments/assets/994dfd10-b351-45d0-84ac-2e0d866db1a2" />

### Lanzamientos en Lote
1. Configura el número de tiradas automáticas (10, 50, 100, o personalizado)
2. Haz clic en **"Iniciar Lote"** para ejecutar múltiples simulaciones
3. Analiza las estadísticas y distribuciones resultantes
<img width="737" height="452" alt="dadointerfaz" src="https://github.com/user-attachments/assets/2b418d6f-7b39-4424-86e7-60f9cde1b5d3" />

### Dinámica Cuántica
1. Después de un lanzamiento, explora la sección **"Dinámica Cuántica"**
2. Activa la **"Dinámica Hamiltoniana"** para ver evolución unitaria
3. Ajusta la **decoherencia** para simular efectos ambientales

## 🔬 Conceptos Cuánticos Implementados

### Superposición y Medición
- Estado inicial: superposición uniforme de todos los estados base
- Medición: colapso probabilístico a un estado definitivo
- Función de onda: representación matemática del estado cuántico

### Entrelazamiento Cuántico
- **Correlación no local**: cara resultante y opuesta están entrelazadas
- **Conservación**: siempre roll + face_down = 7
- **Instantaneidad**: conocer una revela automáticamente la otra

### Hamiltoniano del Sistema
```
H = 7 (constante de conservación)
```
Representa la energía total invariante del sistema cuántico.

### Operadores de Coseno
```
cos(π × roll) y cos(π × face_down)
```
Proyecciones cuánticas que muestran las fases relativas de los estados.

### Corrección de Errores
- **Código [3,1,1]**: 3 qubits físicos, 1 qubit lógico, distancia 1
- **Síndrome**: detección mediante comparación por mayoría
- **Recuperación**: corrección automática de errores únicos

## 🎨 Arquitectura del Código

```
src/
├── App.tsx              # Componente principal
├── types.ts             # Definiciones TypeScript
├── index.tsx            # Punto de entrada
├── components/
│   ├── BlochSphere                    # Visualización 3D
│   ├── OctahedronStateVisualization   # Dado cuántico
│   ├── QuantumErrorCorrection         # Sistema QEC
│   ├── WaveFunctionVisualization      # Función de onda
│   ├── QuantumDynamicsSimulator       # Evolución temporal
│   └── Statistics                     # Análisis estadístico
├── vite.config.ts       # Configuración Vite
├── tsconfig.json        # Configuración TypeScript
└── package.json         # Dependencias
```

## 🔧 Configuración Avanzada

### Variables de Entorno
```bash
# Requerida
GEMINI_API_KEY=your_gemini_api_key_here

# Opcionales
VITE_APP_TITLE="Custom Quantum Simulator"
VITE_DEBUG_MODE=true
```

### Personalización de Estilos
El proyecto usa Tailwind CSS. Modifica los estilos en:
- `tailwind.config.js` - Configuración global
- Componentes individuales - Clases utility

### Ajustes de Performance
```typescript
// En App.tsx - Ajustar delay entre lanzamientos en lote
await new Promise(res => setTimeout(res, 1000)); // 1 segundo
```

## 🤝 Contribución

1. **Fork** el repositorio
2. Crea una rama para tu feature (`git checkout -b feature/nueva-funcionalidad`)
3. **Commit** tus cambios (`git commit -am 'Agregar nueva funcionalidad'`)
4. **Push** a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un **Pull Request**

### Estándares de Código
- Usa TypeScript para tipado estático
- Sigue las convenciones de React Hooks
- Documenta funciones complejas
- Mantén componentes pequeños y reutilizables

## 📝 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🔗 Enlaces Útiles

- [Documentación React](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Google Gemini API](https://ai.google.dev/)
- [Quantum Computing Basics](https://qiskit.org/textbook/)

## 🐛 Reporte de Bugs y Soporte

Si encuentras algún problema o tienes sugerencias:

1. Revisa los [issues existentes](../../issues)
2. Crea un [nuevo issue](../../issues/new) con:
   - Descripción detallada del problema
   - Pasos para reproducir
   - Capturas de pantalla (si aplica)
   - Información del navegador/sistema

## 🙏 Agradecimientos
⭐ **¡Dale una estrella si te gustó el proyecto!** ⭐

Hecho con ❤️ para la educación en computación cuántica gracias a 
- **Google Gemini AI** - Por la API de generación de contenido
- **Comunidad React** - Por las herramientas y librerías
---
<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>
   
# por los recursos 

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1Oz--P5bz0rP8thSRLlCJ4LCQMLXjliFr

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`
