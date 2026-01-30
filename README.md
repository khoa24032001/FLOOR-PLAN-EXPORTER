# Floor Plan Exporter UI

A modern, professional Vue 3 application for configuring and exporting floor plans via the Cubi.casa Exporter API.

## 🌟 Features

- **📤 Drag & Drop Upload**: Intuitive file upload with drag-and-drop support
- **⚙️ Configuration Editor**: Edit floor plan export settings with a clean, organized interface
- **💾 Download Config**: Export your modified configuration as JSON
- **🚀 API Integration**: Export floor plans directly through the Cubi.casa API
- **✨ Modern UI**: Built with shadcn-vue components and Tailwind CSS
- **🎨 Professional Design**: Refined, technical aesthetic with smooth animations
- **📱 Responsive**: Works seamlessly on desktop, tablet, and mobile devices

## 🛠️ Tech Stack

- **Vue 3** - Composition API with `<script setup>`
- **Vite** - Lightning-fast build tool
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn-vue** - High-quality, accessible UI components
- **Axios** - HTTP client for API requests
- **Lucide Icons** - Beautiful, consistent icon set

## 📋 Prerequisites

- Node.js 16+ and npm/pnpm/yarn
- API credentials for Cubi.casa Exporter API

## 🚀 Getting Started

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd floor-plan-exporter

# Install dependencies
npm install
# or
pnpm install
# or
yarn install
```

### Development

```bash
# Start the development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Build for Production

```bash
# Build the application
npm run build

# Preview the production build
npm run preview
```

## 📖 Usage

### Step 1: Upload Configuration

1. Click the upload area or drag and drop a JSON configuration file
2. The file should follow the [Cubi.casa Exporter API schema](https://exporter.docs.cubi.casa/floor-plan-19842092e0)

### Step 2: Edit Configuration

Once uploaded, you can modify:

- **Global Model Options**
  - Measurement unit (meters, feet, or both)
  - Space labels visibility
  - Scale indicator visibility
  - Outer measurements visibility

- **Dimensions**
  - Dimension text visibility
  - Dimension markers visibility
  - Decimal precision for meters

- **Export Settings**
  - Output format (PNG, JPEG, SVG, PDF)
  - DPI/quality settings

### Step 3: Download or Export

- **Download Configuration**: Save your modified configuration as a JSON file
- **Export Floor Plan**: Send the configuration to the API and generate your floor plan

## 🎨 Design Philosophy

This application follows a **refined, professional data tool aesthetic**:

- **Typography**: IBM Plex Sans for clarity and readability, JetBrains Mono for code
- **Color Scheme**: Subtle blue accent (#4169E1) on a neutral background
- **Animations**: Smooth, purposeful transitions that enhance UX
- **Layout**: Clean, organized sections with clear visual hierarchy
- **Components**: Consistent, accessible UI following shadcn design principles

## 🏗️ Project Structure

```
floor-plan-exporter/
├── src/
│   ├── components/
│   │   ├── ui/                    # Reusable UI components
│   │   │   ├── Alert.vue
│   │   │   ├── Button.vue
│   │   │   ├── Card.vue
│   │   │   ├── Checkbox.vue
│   │   │   ├── Input.vue
│   │   │   ├── Label.vue
│   │   │   └── Select.vue
│   │   ├── ConfigEditor.vue       # Configuration form
│   │   ├── DownloadButton.vue     # Download config button
│   │   ├── ExportButton.vue       # API export button
│   │   ├── FileUploader.vue       # File upload component
│   │   └── ResultViewer.vue       # API result display
│   ├── composables/
│   │   └── useExporterApi.js      # API integration
│   ├── utils/
│   │   ├── cn.js                  # Tailwind class merger
│   │   └── downloadFile.js        # File download utility
│   ├── App.vue                     # Main application
│   ├── main.js                     # Application entry point
│   └── style.css                   # Global styles
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## 🔧 Configuration

### API Credentials

API credentials are currently hardcoded in `ExportButton.vue`. For production, these should be:

1. Stored in environment variables
2. Loaded from a config file
3. Obtained through a secure authentication flow

```javascript
// .env
VITE_API_KEY=your-api-key
VITE_MODEL_ID=your-model-id
```

### Tailwind Configuration

The design system uses CSS variables for theming. Modify `src/style.css` to customize colors:

```css
:root {
  --primary: 221 83% 53%;
  --background: 220 20% 97%;
  /* ... */
}
```

## 🎯 Key Components

### FileUploader

- Drag-and-drop file upload
- Click-to-browse functionality
- JSON validation
- Visual feedback for file status

### ConfigEditor

- Organized sections for different config areas
- Form validation
- Two-way data binding with v-model
- Responsive grid layout

### ExportButton

- Loading state during API calls
- Error handling
- Visual feedback

### ResultViewer

- Success/error alerts
- Download link for generated files
- Collapsible raw JSON response
- Professional error messages

## 📝 Example Configuration

```json
{
  "globalModelOptions": {
    "unit": "m",
    "showSpaceLabels": true,
    "showScaleIndicator": true,
    "outerMeasurements": true
  },
  "dimensions": {
    "text": true,
    "markers": true,
    "metersDecimals": 2
  },
  "exports": [
    {
      "format": "png",
      "dpi": 150
    }
  ]
}
```

## 🚧 Future Enhancements

- [ ] Environment variable configuration
- [ ] Support for all API configuration options
- [ ] Array/object configuration editing
- [ ] Configuration templates
- [ ] History/undo functionality
- [ ] Dark mode toggle
- [ ] Multi-language support
- [ ] Configuration validation against API schema
- [ ] Batch export functionality

## 📚 Resources

- [Cubi.casa Exporter API Documentation](https://exporter.docs.cubi.casa/floor-plan-19842092e0)
- [Vue 3 Documentation](https://vuejs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn-vue](https://www.shadcn-vue.com/)

## 📄 License

MIT

## 👤 Author

[Your Name]

## 🙏 Acknowledgments

- Cubi.casa for the Exporter API
- shadcn for the excellent component designs
- The Vue.js team for the amazing framework
