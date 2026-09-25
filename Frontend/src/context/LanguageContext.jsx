import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

export const SUPPORTED_LANGUAGES = [
  { code: "en", name: "English", nativeName: "English", flag: "🇬🇧" },
  { code: "hi", name: "Hindi", nativeName: "हिन्दी", flag: "🇮🇳" },
  { code: "es", name: "Spanish", nativeName: "Español", flag: "🇪🇸" },
  { code: "bn", name: "Bengali", nativeName: "বাংলা", flag: "🇮🇳" },
  { code: "pa", name: "Punjabi", nativeName: "ਪੰਜਾਬੀ", flag: "🇮🇳" },
  { code: "mr", name: "Marathi", nativeName: "मराठी", flag: "🇮🇳" },
  { code: "te", name: "Telugu", nativeName: "తెలుగు", flag: "🇮🇳" },
  { code: "ta", name: "Tamil", nativeName: "தமிழ்", flag: "🇮🇳" },
  { code: "fr", name: "French", nativeName: "Français", flag: "🇫🇷" },
  { code: "de", name: "German", nativeName: "Deutsch", flag: "🇩🇪" },
  { code: "zh", name: "Chinese", nativeName: "中文", flag: "🇨🇳" },
  { code: "ar", name: "Arabic", nativeName: "العربية", flag: "🇸🇦" },
  { code: "pt", name: "Portuguese", nativeName: "Português", flag: "🇵🇹" },
];

// Comprehensive Universal Localization Dictionary
export const UI_DICTIONARY = {
  en: {
    // Nav
    nav_home: "Home",
    nav_scanner: "Scanner",
    nav_twin: "Digital Twin",
    nav_radar: "Radar",
    nav_dosage: "Dosage",
    nav_encyclopedia: "Encyclopedia",
    nav_journal: "Journal",
    nav_scan_leaf: "Scan Leaf",
    system_ready: "System Ready",
    api_offline: "API Offline",
    tagline: "Plant Pathology System",
    hero_title: "AI Precision Agronomy & Crop Disease Intelligence",
    hero_subtitle: "Instant neural diagnostics, microclimate spore forecasting, and autonomous drone defense for growers worldwide.",
    start_diagnosis: "Start Diagnosis",
    explore_twin: "Explore Farm Twin",
    dosage_calc: "Dosage Calculator",
    spore_radar: "Spore Radar",
    plant_encyclopedia: "Encyclopedia",
    scan_history: "Scan History",
    how_it_works: "How It Works",
    select_field: "Select a Field",
    send_drone: "Spray with Drone",
    water_fields: "Water All Fields",
    simulate_outbreak: "Simulate Outbreak",
    reset_farm: "Reset Farm",
    crop_health: "Crop Health",
    disease_risk: "Disease Risk",
    water_level: "Water Level",
    photo_view: "Photo View",
    fullscreen: "Full Screen",
    halfscreen: "Half Screen",
    locate_field: "Locate Field",
    spore_radius: "Spore Radius",
    pathology_dossier: "Plot Pathology Dossier",
    crop_variety: "Crop Variety",
    overall_health: "Overall Health",
    risk_zone: "Risk Zone",
    gps_coords: "GPS Coordinates",
    last_inspected: "Last Inspected",
    containment_protocol: "Containment Protocol",
    critical_blight: "Critical Blight",
    moderate_blight: "Moderate Blight",
    healthy_plots: "Healthy Plots",
    switch_language: "Select Language",
    powered_by_libre: "Powered by LibreTranslate Engine",
    upload_photo: "Upload Leaf Photo",
    take_photo: "Take Live Photo",
    drag_drop_text: "Drag and drop leaf image here, or click browse",
    supported_formats: "Supports PNG, JPG, JPEG • High-resolution foliar macro scans",
    sample_specimens: "Try Sample Specimens",
    analyze_button: "Run AI Disease Diagnosis",
    analyzing_text: "Analyzing Leaf Tissue with Neural Vision...",
    confidence_score: "Confidence Score",
    severity_assessment: "Severity Assessment",
    recommended_actions: "Recommended Actions",
    chemical_treatments: "Chemical Treatments",
    organic_remedies: "Organic Remedies",
    dosage_info: "Recommended Dosage",
    download_pdf: "Download Diagnostic Certificate PDF",
    clear_image: "Clear Image",
    healthy_specimen: "Healthy Specimen",
    early_blight: "Early Blight",
    late_blight: "Late Blight",
    ask_agronomist: "Ask Dr. Flora Agronomist",
    type_question: "Ask about dosages, crop care, fungicides...",
    send: "Send",
  },
  hi: {
    nav_home: "होम",
    nav_scanner: "स्कैनर",
    nav_twin: "डिजिटल ट्विन",
    nav_radar: "रडार",
    nav_dosage: "दवा खुराक",
    nav_encyclopedia: "फसल ज्ञानकोश",
    nav_journal: "इतिहास",
    nav_scan_leaf: "पत्ती स्कैन करें",
    system_ready: "सिस्टम तैयार",
    api_offline: "ऑफ़लाइन",
    tagline: "पादप रोग पहचान प्रणाली",
    hero_title: "एआई सटीक कृषि और फसल रोग निदान प्रणाली",
    hero_subtitle: "त्वरित फसल रोग पहचान, मौसम पूर्वानुमान और स्वचालित ड्रोन छिड़काव सुरक्षा।",
    start_diagnosis: "जांच शुरू करें",
    explore_twin: "डिजिटल फार्म देखें",
    dosage_calc: "खुराक कैलकुलेटर",
    spore_radar: "रोग रडार",
    plant_encyclopedia: "ज्ञानकोश",
    scan_history: "स्कैन इतिहास",
    how_it_works: "यह कैसे काम करता है",
    select_field: "खेत चुनें",
    send_drone: "ड्रोन से छिड़काव करें",
    water_fields: "सिंचाई चालू करें",
    simulate_outbreak: "रोग प्रकोप सिमुलेशन",
    reset_farm: "फार्म रीसेट करें",
    crop_health: "फसल स्वास्थ्य",
    disease_risk: "रोग जोखिम",
    water_level: "जल स्तर",
    photo_view: "उपग्रह फोटो",
    fullscreen: "फुल स्क्रीन",
    halfscreen: "हाफ स्क्रीन",
    locate_field: "स्थान खोजें",
    spore_radius: "संक्रमण दायरा",
    pathology_dossier: "खेत रोग रिपोर्ट",
    crop_variety: "फसल किस्म",
    overall_health: "कुल स्वास्थ्य",
    risk_zone: "जोखिम क्षेत्र",
    gps_coords: "जीपीएस निर्देशांक",
    last_inspected: "अंतिम निरीक्षण",
    containment_protocol: "रोकथाम प्रोटोकॉल",
    critical_blight: "गंभीर रोग",
    moderate_blight: "मध्यम रोग",
    healthy_plots: "स्वस्थ खेत",
    switch_language: "भाषा चुनें",
    powered_by_libre: "LibreTranslate द्वारा अनुवादित",
    upload_photo: "पत्ती की फोटो अपलोड करें",
    take_photo: "कैमरे से फोटो लें",
    drag_drop_text: "पत्ती की फोटो यहां खींचें या ब्राउज़ करें",
    supported_formats: "PNG, JPG, JPEG समर्थित",
    sample_specimens: "नमूना पत्ती जांचें",
    analyze_button: "एआई रोग निदान शुरू करें",
    analyzing_text: "पत्ती के ऊतकों का विश्लेषण हो रहा है...",
    confidence_score: "सटीकता स्कोर",
    severity_assessment: "रोग की गंभीरता",
    recommended_actions: "सुझाई गई कार्रवाई",
    chemical_treatments: "रासायनिक उपचार",
    organic_remedies: "जैविक उपचार",
    dosage_info: "दवा की मात्रा",
    download_pdf: "निदान प्रमाण पत्र PDF डाउनलोड करें",
    clear_image: "छवि हटाएं",
    healthy_specimen: "स्वस्थ पत्ती",
    early_blight: "अगेती झुलसा (Early Blight)",
    late_blight: "पछेती झुलसा (Late Blight)",
    ask_agronomist: "डॉ. फ्लोरा कृषि विशेषज्ञ से पूछें",
    type_question: "दवा, सिंचाई या फसल सुरक्षा के बारे में पूछें...",
    send: "भेजें",
  },
  es: {
    nav_home: "Inicio",
    nav_scanner: "Escáner",
    nav_twin: "Gemelo Digital",
    nav_radar: "Radar",
    nav_dosage: "Dosis",
    nav_encyclopedia: "Enciclopedia",
    nav_journal: "Historial",
    nav_scan_leaf: "Escanear Hoja",
    system_ready: "Sistema Listo",
    api_offline: "API Desconectada",
    tagline: "Sistema de Patología Vegetal",
    hero_title: "Agronomía de Precisión e Inteligencia de Cultivos con IA",
    hero_subtitle: "Diagnósticos instantáneos, pronósticos de esporas microclimáticas y defensa con drones autónomos.",
    start_diagnosis: "Iniciar Diagnóstico",
    explore_twin: "Explorar Gemelo Digital",
    dosage_calc: "Calculadora de Dosis",
    spore_radar: "Radar de Esporas",
    plant_encyclopedia: "Enciclopedia",
    scan_history: "Historial",
    how_it_works: "Cómo Funciona",
    select_field: "Seleccionar Parcela",
    send_drone: "Fumigar con Dron",
    water_fields: "Regar Parcelas",
    simulate_outbreak: "Simular Brote",
    reset_farm: "Restablecer Finca",
    crop_health: "Salud del Cultivo",
    disease_risk: "Riesgo de Enfermedad",
    water_level: "Nivel de Agua",
    photo_view: "Vista Satelital",
    fullscreen: "Pantalla Completa",
    halfscreen: "Media Pantalla",
    locate_field: "Ubicar Parcela",
    spore_radius: "Radio de Esporas",
    pathology_dossier: "Expediente de Patología",
    crop_variety: "Variedad de Cultivo",
    overall_health: "Salud General",
    risk_zone: "Zona de Riesgo",
    gps_coords: "Coordenadas GPS",
    last_inspected: "Última Inspección",
    containment_protocol: "Protocolo de Contención",
    critical_blight: "Tizón Crítico",
    moderate_blight: "Tizón Moderado",
    healthy_plots: "Parcelas Sanas",
    switch_language: "Seleccionar Idioma",
    powered_by_libre: "Traducido con LibreTranslate",
    upload_photo: "Subir Foto de Hoja",
    take_photo: "Tomar Foto en Vivo",
    drag_drop_text: "Arrastra y suelta la foto de la hoja aquí",
    supported_formats: "Compatible con PNG, JPG, JPEG",
    sample_specimens: "Probar Muestras",
    analyze_button: "Ejecutar Diagnóstico IA",
    analyzing_text: "Analizando tejido foliar...",
    confidence_score: "Nivel de Confianza",
    severity_assessment: "Evaluación de Gravedad",
    recommended_actions: "Acciones Recomendadas",
    chemical_treatments: "Tratamientos Químicos",
    organic_remedies: "Remedios Orgánicos",
    dosage_info: "Dosis Recomendada",
    download_pdf: "Descargar Certificado PDF",
    clear_image: "Borrar Imagen",
    healthy_specimen: "Muestra Sana",
    early_blight: "Tizón Temprano",
    late_blight: "Tizón Tardío",
    ask_agronomist: "Consultar con Dra. Flora",
    type_question: "Pregunta sobre dosis, fungicidas, cuidado...",
    send: "Enviar",
  },
  bn: {
    nav_home: "হোম",
    nav_scanner: "স্ক্যানার",
    nav_twin: "ডিজিটাল টুইন",
    nav_radar: "রাডার",
    nav_dosage: "ওষুধের মাত্রা",
    nav_encyclopedia: "বিশ্বকোষ",
    nav_journal: "ইতিহাস",
    nav_scan_leaf: "পাতা স্ক্যান করুন",
    system_ready: "সিস্টেম প্রস্তুত",
    api_offline: "অফলাইন",
    tagline: "উদ্ভিদ রোগ নির্ণয় পদ্ধতি",
    hero_title: "কৃষি নির্ভুলতা ও শস্য রোগ গোয়েন্দা ব্যবস্থা",
    hero_subtitle: "তাত্ক্ষণিক পাতার রোগ নির্ণয়, স্পোর পূর্বাভাস এবং স্বয়ংক্রিয় ড্রোন স্প্রে।",
    start_diagnosis: "পরীক্ষা শুরু করুন",
    explore_twin: "ডিজিটাল খামার দেখুন",
    dosage_calc: "ডোজ ক্যালকুলেটর",
    spore_radar: "স্পোর রাডার",
    plant_encyclopedia: "বিশ্বকোষ",
    scan_history: "স্ক্যান ইতিহাস",
    how_it_works: "এটি কীভাবে কাজ করে",
    select_field: "জমি নির্বাচন করুন",
    send_drone: "ড্রোন দিয়ে স্প্রে করুন",
    water_fields: "সেচ চালু করুন",
    simulate_outbreak: "রোগের প্রাদুর্ভাব অনুকরণ",
    reset_farm: "খামার পুনরায় সেট করুন",
    crop_health: "ফসলের স্বাস্থ্য",
    disease_risk: "রোগের ঝুঁকি",
    water_level: "পানির স্তর",
    photo_view: "স্যাটেলাইট ছবি",
    fullscreen: "পূর্ণ পর্দা",
    halfscreen: "অর্ধ পর্দা",
    locate_field: "অবস্থান সন্ধান করুন",
    spore_radius: "সংক্রমণের পরিসর",
    pathology_dossier: "জমির রোগ বিবরণী",
    crop_variety: "ফসলের জাত",
    overall_health: "সামগ্রিক স্বাস্থ্য",
    risk_zone: "ঝুঁকি অঞ্চল",
    gps_coords: "জিপিএস স্থানাঙ্ক",
    last_inspected: "শেষ পরিদর্শন",
    containment_protocol: "নিয়ন্ত্রণ প্রোটোকল",
    critical_blight: "মারাত্মক ব্লাইট",
    moderate_blight: "মাঝারি ব্লাইট",
    healthy_plots: "সুস্থ জমি",
    switch_language: "ভাষা নির্বাচন করুন",
    powered_by_libre: "LibreTranslate দ্বারা পরিচালিত",
    upload_photo: "পাতার ছবি আপলোড করুন",
    take_photo: "সরাসরি ছবি তুলুন",
    drag_drop_text: "পাতার ছবি এখানে টেনে আনুন বা ব্রাউজ করুন",
    supported_formats: "PNG, JPG, JPEG সমর্থিত",
    sample_specimens: "নমুনা পাতা পরীক্ষা করুন",
    analyze_button: "এআই রোগ নির্ণয় শুরু করুন",
    analyzing_text: "পাতার টিস্যু বিশ্লেষণ করা হচ্ছে...",
    confidence_score: "নির্ভুলতার স্কোর",
    severity_assessment: "রোগের তীব্রতা",
    recommended_actions: "প্রস্তাবিত পদক্ষেপ",
    chemical_treatments: "রাসায়নিক চিকিৎসা",
    organic_remedies: "জৈব প্রতিকার",
    dosage_info: "প্রস্তাবিত মাত্রা",
    download_pdf: "ডায়াগনস্টিক সার্টিফিকেট PDF ডাউনলোড করুন",
    clear_image: "ছবি মুছুন",
    healthy_specimen: "সুস্থ পাতা",
    early_blight: "আর্লি ব্লাইট (Early Blight)",
    late_blight: "লেট ব্লাইট (Late Blight)",
    ask_agronomist: "ড. ফ্লোরা কৃষি বিশেষজ্ঞকে জিজ্ঞাসা করুন",
    type_question: "ওষুধের মাত্রা, সেচ বা ছত্রাকনাশক সম্পর্কে জিজ্ঞাসা করুন...",
    send: "পাঠান",
  },
  pa: {
    nav_home: "ਘਰ",
    nav_scanner: "ਸਕੈਨਰ",
    nav_twin: "ਡਿਜੀਟਲ ਫਾਰਮ",
    nav_radar: "ਰਡਾਰ",
    nav_dosage: "ਦਵਾਈ ਦੀ ਖੁਰਾਕ",
    nav_encyclopedia: "ਜਾਣਕਾਰੀ ਕੋਸ਼",
    nav_journal: "ਇਤਿਹਾਸ",
    nav_scan_leaf: "ਪੱਤਾ ਸਕੈਨ ਕਰੋ",
    system_ready: "ਸਿਸਟਮ ਤਿਆਰ",
    api_offline: "ਆਫ਼ਲਾਈਨ",
    tagline: "ਪੌਦਿਆਂ ਦੀਆਂ ਬਿਮਾਰੀਆਂ ਦਾ ਪਤਾ ਲਗਾਉਣ ਵਾਲੀ ਪ੍ਰਣਾਲੀ",
    hero_title: "ਏਆਈ ਸ਼ੁੱਧ ਖੇਤੀਬਾੜੀ ਅਤੇ ਫਸਲ ਰੋਗ ਨਿਦਾਨ",
    hero_subtitle: "ਤੁਰੰਤ ਫਸਲ ਦੀ ਬਿਮਾਰੀ ਦੀ ਜਾਂਚ ਅਤੇ ਡਰੋਨ ਸਪਰੇਅ ਸੁਰੱਖਿਆ।",
    start_diagnosis: "ਜਾਂਚ ਸ਼ੁਰੂ ਕਰੋ",
    explore_twin: "ਫਾਰਮ ਵੇਖੋ",
    dosage_calc: "ਖੁਰਾਕ ਕੈਲਕੁਲੇਟਰ",
    spore_radar: "ਰੋਗ ਰਡਾਰ",
    plant_encyclopedia: "ਜਾਣਕਾਰੀ ਕੋਸ਼",
    scan_history: "ਇਤਿਹਾਸ",
    how_it_works: "ਇਹ ਕਿਵੇਂ ਕੰਮ ਕਰਦਾ ਹੈ",
    select_field: "ਖੇਤ ਚੁਣੋ",
    send_drone: "ਡਰੋਨ ਨਾਲ ਸਪਰੇਅ ਕਰੋ",
    water_fields: "ਸਿੰਚਾਈ ਚਾਲੂ ਕਰੋ",
    simulate_outbreak: "ਬਿਮਾਰੀ ਦਾ ਪ੍ਰਕੋਪ ਟੈਸਟ",
    reset_farm: "ਫਾਰਮ ਰੀਸੈੱਟ ਕਰੋ",
    crop_health: "ਫਸਲ ਦੀ ਸਿਹਤ",
    disease_risk: "ਬਿਮਾਰੀ ਦਾ ਖਤਰਾ",
    water_level: "ਪਾਣੀ ਦਾ ਪੱਧਰ",
    photo_view: "ਸੈਟੇਲਾਈਟ ਫੋਟੋ",
    fullscreen: "ਪੂਰੀ ਸਕ੍ਰੀਨ",
    halfscreen: "ਅੱਧੀ ਸਕ੍ਰੀਨ",
    locate_field: "ਸਥਾਨ ਲੱਭੋ",
    spore_radius: "ਸੰਕਰਮਣ ਖੇਤਰ",
    pathology_dossier: "ਖੇਤ ਰਿਪੋਰਟ",
    crop_variety: "ਫਸਲ ਦੀ ਕਿਸਮ",
    overall_health: "ਕੁੱਲ ਸਿਹਤ",
    risk_zone: "ਖ਼ਤਰਾ ਖੇਤਰ",
    gps_coords: "ਜੀਪੀਐਸ ਨਿਰਦੇਸ਼ਾਂਕ",
    last_inspected: "ਆਖਰੀ ਨਿਰੀਖਣ",
    containment_protocol: "ਰੋਕਥਾਮ ਪ੍ਰੋਟੋਕੋਲ",
    critical_blight: "ਗੰਭੀਰ ਬਿਮਾਰੀ",
    moderate_blight: "ਦਰਮਿਆਨੀ ਬਿਮਾਰੀ",
    healthy_plots: "ਤੰਦਰੁਸਤ ਖੇਤ",
    switch_language: "ਭਾਸ਼ਾ ਚੁਣੋ",
    powered_by_libre: "LibreTranslate ਦੁਆਰਾ ਅਨੁਵਾਦਿਤ",
    upload_photo: "ਪੱਤੇ ਦੀ ਫੋਟੋ ਅਪਲੋਡ ਕਰੋ",
    take_photo: "ਕੈਮਰੇ ਨਾਲ ਫੋਟੋ ਖਿੱਚੋ",
    drag_drop_text: "ਪੱਤੇ ਦੀ ਫੋਟੋ ਇੱਥੇ ਖਿੱਚੋ ਜਾਂ ਬ੍ਰਾਊਜ਼ ਕਰੋ",
    supported_formats: "PNG, JPG, JPEG ਸਮਰਥਿਤ",
    sample_specimens: "ਨਮੂਨਾ ਪੱਤਾ ਟੈਸਟ ਕਰੋ",
    analyze_button: "ਏਆਈ ਬਿਮਾਰੀ ਜਾਂਚ ਸ਼ੁਰੂ ਕਰੋ",
    analyzing_text: "ਪੱਤੇ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕੀਤਾ ਜਾ ਰਿਹਾ ਹੈ...",
    confidence_score: "ਸ਼ੁੱਧਤਾ ਸਕੋਰ",
    severity_assessment: "ਬਿਮਾਰੀ ਦੀ ਗੰਭੀਰਤਾ",
    recommended_actions: "ਸਿਫ਼ਾਰਸ਼ ਕੀਤੀ ਕਾਰਵਾਈ",
    chemical_treatments: "ਰਸਾਇਣਕ ਇਲਾਜ",
    organic_remedies: "ਜੈਵਿਕ ਉਪਚਾਰ",
    dosage_info: "ਦਵਾਈ ਦੀ ਖੁਰਾਕ",
    download_pdf: "ਸਰਟੀਫਿਕੇਟ PDF ਡਾਊਨਲੋਡ ਕਰੋ",
    clear_image: "ਤਸਵੀਰ ਹਟਾਓ",
    healthy_specimen: "ਤੰਦਰੁਸਤ ਪੱਤਾ",
    early_blight: "ਅਗੇਤਾ ਝੁਲਸ ਰੋਗ",
    late_blight: "ਪਛੇਤਾ ਝੁਲਸ ਰੋਗ",
    ask_agronomist: "ਡਾ. ਫਲੋਰਾ ਮਾਹਿਰ ਨੂੰ ਪੁੱਛੋ",
    type_question: "ਦਵਾਈ, ਸਿੰਚਾਈ ਜਾਂ ਖੁਰਾਕ ਬਾਰੇ ਪੁੱਛੋ...",
    send: "ਭੇਜੋ",
  },
  mr: {
    nav_home: "मुख्यपृष्ठ",
    nav_scanner: "स्कॅनर",
    nav_twin: "डिजिटल ट्विन",
    nav_radar: "रडार",
    nav_dosage: "मात्रा",
    nav_encyclopedia: "ज्ञानकोश",
    nav_journal: "इतिहास",
    nav_scan_leaf: "पान स्कॅन करा",
    system_ready: "प्रणाली सज्ज",
    api_offline: "ऑफलाइन",
    tagline: "वनस्पती रोग निदान प्रणाली",
    hero_title: "एआय अचूक शेती आणि पीक रोग निदान",
    hero_subtitle: "झटपट पीक रोग निदान, हवामान अंदाज आणि स्वयंचलित ड्रोन फवारणी.",
    start_diagnosis: "तपासणी सुरू करा",
    explore_twin: "डिजिटल शेत पहा",
    dosage_calc: "मात्रा गणक",
    spore_radar: "रोग रडार",
    plant_encyclopedia: "ज्ञानकोश",
    scan_history: "स्कॅन इतिहास",
    how_it_works: "हे कसे कार्य करते",
    select_field: "शेत निवडा",
    send_drone: "ड्रोनने फवारणी करा",
    water_fields: "सिंचन सुरू करा",
    simulate_outbreak: "रोग प्रादुर्भाव चाचणी",
    reset_farm: "शेत पूर्ववत करा",
    crop_health: "पीक आरोग्य",
    disease_risk: "रोग धोका",
    water_level: "पाणी पातळी",
    photo_view: "उपग्रह दृश्य",
    fullscreen: "पूर्ण स्क्रीन",
    halfscreen: "अर्धी स्क्रीन",
    locate_field: "स्थान शोधा",
    spore_radius: "संसर्ग त्रिज्या",
    pathology_dossier: "शेत रोग अहवाल",
    crop_variety: "पीक वाण",
    overall_health: "एकूण आरोग्य",
    risk_zone: "धोका क्षेत्र",
    gps_coords: "जीपीएस निर्देशांक",
    last_inspected: "शेवटची तपासणी",
    containment_protocol: "नियंत्रण नियम",
    critical_blight: "गंभीर करपा",
    moderate_blight: "मध्यम करपा",
    healthy_plots: "निरोगी शेत",
    switch_language: "भाषा निवडा",
    powered_by_libre: "LibreTranslate द्वारे समर्थित",
    upload_photo: "पानाचा फोटो अपलोड करा",
    take_photo: "कॅमेऱ्याने फोटो घ्या",
    drag_drop_text: "पानाचा फोटो येथे ड्रॅग करा किंवा निवडा",
    supported_formats: "PNG, JPG, JPEG समर्थित",
    sample_specimens: "नमुना पाने तपासा",
    analyze_button: "एआय रोग निदान सुरू करा",
    analyzing_text: "पानाचे विश्लेषण सुरू आहे...",
    confidence_score: "अचूकता गुण",
    severity_assessment: "रोगाची तीव्रता",
    recommended_actions: "शिफारस केलेल्या कृती",
    chemical_treatments: "रासायनिक उपचार",
    organic_remedies: "सेंद्रिय उपाय",
    dosage_info: "औषधाची मात्रा",
    download_pdf: "प्रमाणपत्र PDF डाउनलोड करा",
    clear_image: "फोटो हटवा",
    healthy_specimen: "निरोगी पान",
    early_blight: "लवकर येणारा करपा (Early Blight)",
    late_blight: "उशिरा येणारा करपा (Late Blight)",
    ask_agronomist: "डॉ. फ्लोरा कृषी तज्ज्ञांना विचारा",
    type_question: "फवारणी, खते किंवा रोग नियंत्रणाबद्दल विचारा...",
    send: "पाठवा",
  },
  te: {
    nav_home: "హోమ్",
    nav_scanner: "స్కానర్",
    nav_twin: "డిజిటల్ ట్విన్",
    nav_radar: "రాడార్",
    nav_dosage: "మోతాదు",
    nav_encyclopedia: "విజ్ఞాన సర్వస్వం",
    nav_journal: "చరిత్ర",
    nav_scan_leaf: "ఆకును స్కాన్ చేయండి",
    system_ready: "వ్యవస్థ సిద్ధంగా ఉంది",
    api_offline: "ఆఫ్‌లైన్",
    tagline: "మొక్కల వ్యాధి నిర్ధారణ వ్యవస్థ",
    hero_title: "ఏఐ ఖచ్చితమైన వ్యవసాయం మరియు పంట వ్యాధి నిర్ధారణ",
    hero_subtitle: "తక్షణ పంట వ్యాధి నిర్ధారణ, వాతావరణ అంచనాలు మరియు డ్రోన్ రక్షణ.",
    start_diagnosis: "తనిఖీ ప్రారంభించండి",
    explore_twin: "డిజిటల్ ఫారమ్ చూడండి",
    dosage_calc: "మోతాదు కాలిక్యులేటర్",
    spore_radar: "వ్యాధి రాడార్",
    plant_encyclopedia: "విజ్ఞాన సర్వస్వం",
    scan_history: "స్కాన్ చరిత్ర",
    how_it_works: "ఇది ఎలా పనిచేస్తుంది",
    select_field: "పొలం ఎంచుకోండి",
    send_drone: "డ్రోన్ తో స్ప్రే చేయండి",
    water_fields: "నీటిపారుదల ప్రారంభించండి",
    simulate_outbreak: "వ్యాధి వ్యాప్తి అనుకరణ",
    reset_farm: "ఫారం రీసెట్ చేయండి",
    crop_health: "పంట ఆరోగ్యం",
    disease_risk: "వ్యాధి ప్రమాదం",
    water_level: "నీటి స్థాయి",
    photo_view: "శాటిలైట్ ఫోటో",
    fullscreen: "పూర్తి స్క్రీన్",
    halfscreen: "సగం స్క్రీన్",
    locate_field: "లొకేషన్ కనుగొనండి",
    spore_radius: "వ్యాప్తి వ్యాసార్థం",
    pathology_dossier: "పొలం నివేదిక",
    crop_variety: "పంట రకం",
    overall_health: "మొత్తం ఆరోగ్యం",
    risk_zone: "ప్రమాద ప్రాంతం",
    gps_coords: "జీపీఎస్ కోఆర్డినేట్స్",
    last_inspected: "చివరి తనిఖీ",
    containment_protocol: "నియంత్రణ ప్రోటోకాల్",
    critical_blight: "తీవ్రమైన తెగులు",
    moderate_blight: "మధ్యస్థ తెగులు",
    healthy_plots: "ఆరోగ్యకరమైన పొలాలు",
    switch_language: "భాషను ఎంచుకోండి",
    powered_by_libre: "LibreTranslate ద్వారా అనువదించబడింది",
    upload_photo: "ఆకు ఫోటో అప్‌లోడ్ చేయండి",
    take_photo: "కెమెరాతో ఫోటో తీయండి",
    drag_drop_text: "ఆకు ఫోటో ఇక్కడ డ్రాగ్ చేయండి లేదా ఎంచుకోండి",
    supported_formats: "PNG, JPG, JPEG సపోర్ట్ ఉంది",
    sample_specimens: "నమూనా ఆకులు పరీక్షించండి",
    analyze_button: "ఏఐ వ్యాధి నిర్ధారణ ప్రారంభించండి",
    analyzing_text: "ఆకు కణజాలం విశ్లేషించబడుతోంది...",
    confidence_score: "ఖచ్చితత్వ స్కోరు",
    severity_assessment: "వ్యాధి తీవ్రత",
    recommended_actions: "సిఫార్సు చేయబడిన చర్యలు",
    chemical_treatments: "రసాయన చికిత్సలు",
    organic_remedies: "సేంద్రీయ నివారణలు",
    dosage_info: "సిఫార్సు చేసిన మోతాదు",
    download_pdf: "సర్టిఫికెట్ PDF డౌన్‌లోడ్ చేసుకోండి",
    clear_image: "చిత్రాన్ని తొలగించు",
    healthy_specimen: "ఆరోగ్యకరమైన ఆకు",
    early_blight: "ముందస్తు తెగులు (Early Blight)",
    late_blight: "ఆలస్యపు తెగులు (Late Blight)",
    ask_agronomist: "డాక్టర్ ఫ్లోరా వ్యవసాయ నిపుణుడిని అడగండి",
    type_question: "మందుల మోతాదు, తెగులు నివారణ గురించి అడగండి...",
    send: "పంపండి",
  },
  ta: {
    nav_home: "முகப்பு",
    nav_scanner: "ஸ்கேனர்",
    nav_twin: "டிஜிட்டல் பண்ணை",
    nav_radar: "ரேடார்",
    nav_dosage: "மருந்து அளவு",
    nav_encyclopedia: "களஞ்சியம்",
    nav_journal: "வரலாறு",
    nav_scan_leaf: "இலையை ஸ்கேன் செய்",
    system_ready: "அமைப்பு தயார்",
    api_offline: "ஆஃப்லைன்",
    tagline: "தாவர நோய் கண்டறிதல் அமைப்பு",
    hero_title: "AI துல்லிய வேளாண்மை மற்றும் பயிர் நோய் நுண்ணறிவு",
    hero_subtitle: "உடனடி தாவர நோய் கண்டறிதல், வானிலை எச்சரிக்கை மற்றும் ட்ரோன் தெளிப்பு பாதுகாப்பு.",
    start_diagnosis: "ஆரம்பிக்கவும்",
    explore_twin: "பண்ணையை பார்க்கவும்",
    dosage_calc: "மருந்து கால்குலேட்டர்",
    spore_radar: "நோய் ரேடார்",
    plant_encyclopedia: "களஞ்சியம்",
    scan_history: "ஸ்கேன் வரலாறு",
    how_it_works: "எவ்வாறு செயல்படுகிறது",
    select_field: "நிலத்தை தேர்வு செய்க",
    send_drone: "ட்ரோன் மூலம் தெளிக்கவும்",
    water_fields: "பாசனம் செய்க",
    simulate_outbreak: "நோய் பரவல் சோதனை",
    reset_farm: "பண்ணையை மீட்டமைக்கவும்",
    crop_health: "பயிர் நலம்",
    disease_risk: "நோய் அபாயம்",
    water_level: "நீர் அளவு",
    photo_view: "செயற்கைக்கோள் காட்சி",
    fullscreen: "முழுத்திரை",
    halfscreen: "அரைத்திரை",
    locate_field: "இருப்பிடத்தைக் காண்க",
    spore_radius: "பரவல் ஆரம்",
    pathology_dossier: "நோய் அறிக்கை",
    crop_variety: "பயிர் ரகம்",
    overall_health: "ஒட்டுமொத்த நலம்",
    risk_zone: "அபாய மண்டலம்",
    gps_coords: "ஜிபிஎஸ் ஒருங்கிணைப்புகள்",
    last_inspected: "கடைசி ஆய்வு",
    containment_protocol: "கட்டுப்பாட்டு விதிமுறைகள்",
    critical_blight: "தீவிர நோய்",
    moderate_blight: "மிதமான நோய்",
    healthy_plots: "ஆரோக்கியமான நிலங்கள்",
    switch_language: "மொழியைத் தேர்வுசெய்",
    powered_by_libre: "LibreTranslate மூலம் இயக்கப்படுகிறது",
    upload_photo: "இலை புகைப்படத்தைப் பதிவேற்றவும்",
    take_photo: "கேமரா மூலம் படம் பிடிக்கவும்",
    drag_drop_text: "இலை படத்தை இங்கே இழுக்கவும்",
    supported_formats: "PNG, JPG, JPEG ஆதரிக்கப்படுகிறது",
    sample_specimens: "மாதிரி இலைகளைச் சோதிக்கவும்",
    analyze_button: "AI நோய் கண்டறிதலைத் தொடங்கு",
    analyzing_text: "இலை திசுக்கள் பகுப்பாய்வு செய்யப்படுகின்றன...",
    confidence_score: "துல்லிய மதிப்பெண்",
    severity_assessment: "நோயின் தீவிரம்",
    recommended_actions: "பரிந்துரைக்கப்பட்ட நடவடிக்கைகள்",
    chemical_treatments: "இரசாயன சிகிச்சைகள்",
    organic_remedies: "இயற்கை தீர்வுகள்",
    dosage_info: "பரிந்துரைக்கப்பட்ட மருந்து அளவு",
    download_pdf: "சான்றிதழ் PDF பதிவிறக்கவும்",
    clear_image: "படத்தை அழி",
    healthy_specimen: "ஆரோக்கியமான இலை",
    early_blight: "முன்கூட்டிய கருகல் நோய்",
    late_blight: "பின்கூட்டிய கருகல் நோய்",
    ask_agronomist: "டாக்டர் புளோரா நிபுணரிடம் கேளுங்கள்",
    type_question: "மருந்து அளவு, பயிர் பாதுகாப்பு பற்றி கேளுங்கள்...",
    send: "அனுப்பு",
  },
  fr: {
    nav_home: "Accueil",
    nav_scanner: "Scanner",
    nav_twin: "Jumeau Numérique",
    nav_radar: "Radar",
    nav_dosage: "Dosage",
    nav_encyclopedia: "Encyclopédie",
    nav_journal: "Journal",
    nav_scan_leaf: "Scanner Feuille",
    system_ready: "Système Prêt",
    api_offline: "API Hors Ligne",
    tagline: "Système de Pathologie Végétale",
    hero_title: "Agronomie de Précision et Intelligence Phytopathologique IA",
    hero_subtitle: "Diagnostics instantanés, prévision des spores microclimatiques et défense par drones autonomes.",
    start_diagnosis: "Démarrer Diagnostic",
    explore_twin: "Explorer la Ferme",
    dosage_calc: "Calculateur de Dosage",
    spore_radar: "Radar de Spores",
    plant_encyclopedia: "Encyclopédie",
    scan_history: "Historique",
    how_it_works: "Comment ça marche",
    select_field: "Sélectionner Parcelle",
    send_drone: "Pulvériser par Drone",
    water_fields: "Arroser les Champs",
    simulate_outbreak: "Simuler Épidémie",
    reset_farm: "Réinitialiser Ferme",
    crop_health: "Santé des Cultures",
    disease_risk: "Risque de Maladie",
    water_level: "Niveau d'Eau",
    photo_view: "Vue Satellite",
    fullscreen: "Plein Écran",
    halfscreen: "Demi-Écran",
    locate_field: "Localiser Parcelle",
    spore_radius: "Rayon de Spores",
    pathology_dossier: "Dossier Pathologique",
    crop_variety: "Variété de Culture",
    overall_health: "Santé Globale",
    risk_zone: "Zone de Risque",
    gps_coords: "Coordonnées GPS",
    last_inspected: "Dernière Inspection",
    containment_protocol: "Protocole de Confinement",
    critical_blight: "Mildiou Critique",
    moderate_blight: "Mildiou Modéré",
    healthy_plots: "Parcelles Saines",
    switch_language: "Changer de Langue",
    powered_by_libre: "Traduit par LibreTranslate",
    upload_photo: "Téléverser Photo Feuille",
    take_photo: "Prendre une Photo",
    drag_drop_text: "Glissez et déposez la photo ici",
    supported_formats: "Prend en charge PNG, JPG, JPEG",
    sample_specimens: "Tester Spécimens",
    analyze_button: "Lancer Diagnostic IA",
    analyzing_text: "Analyse du tissu foliaire...",
    confidence_score: "Score de Confiance",
    severity_assessment: "Évaluation de Gravité",
    recommended_actions: "Actions Recommandées",
    chemical_treatments: "Traitements Chimiques",
    organic_remedies: "Remèdes Biologiques",
    dosage_info: "Dosage Recommandé",
    download_pdf: "Télécharger Certificat PDF",
    clear_image: "Effacer l'Image",
    healthy_specimen: "Feuille Saine",
    early_blight: "Alternariose (Early Blight)",
    late_blight: "Mildiou (Late Blight)",
    ask_agronomist: "Consulter Dr. Flora",
    type_question: "Posez votre question sur les fongicides, dosages...",
    send: "Envoyer",
  },
  de: {
    nav_home: "Startseite",
    nav_scanner: "Scanner",
    nav_twin: "Digitaler Zwilling",
    nav_radar: "Radar",
    nav_dosage: "Dosierung",
    nav_encyclopedia: "Enzyklopädie",
    nav_journal: "Journal",
    nav_scan_leaf: "Blatt Scannen",
    system_ready: "System Bereit",
    api_offline: "API Offline",
    tagline: "Pflanzenpathologie-System",
    hero_title: "KI-Präzisionsagronomie & Pflanzenschutz-Intelligenz",
    hero_subtitle: "Sofortige neuronale Diagnostik, Sporen-Mikroklima-Vorhersage und autonome Drohnenabwehr.",
    start_diagnosis: "Diagnose Starten",
    explore_twin: "Farm-Zwilling Erkunden",
    dosage_calc: "Dosierungsrechner",
    spore_radar: "Sporenradar",
    plant_encyclopedia: "Enzyklopädie",
    scan_history: "Verlauf",
    how_it_works: "So Funktioniert Es",
    select_field: "Feld Auswählen",
    send_drone: "Mit Drohne Besprühen",
    water_fields: "Felder Bewässern",
    simulate_outbreak: "Ausbruch Simulieren",
    reset_farm: "Farm Zurücksetzen",
    crop_health: "Pflanzengesundheit",
    disease_risk: "Krankheitsrisiko",
    water_level: "Wasserstand",
    photo_view: "Satellitenfoto",
    fullscreen: "Vollbild",
    halfscreen: "Halbbild",
    locate_field: "Feld Lokalisieren",
    spore_radius: "Sporenradius",
    pathology_dossier: "Pathologie-Dossier",
    crop_variety: "Pflanzenart",
    overall_health: "Gesamtzustand",
    risk_zone: "Risikozone",
    gps_coords: "GPS-Koordinaten",
    last_inspected: "Zuletzt Geprüft",
    containment_protocol: "Eindämmungsprotokoll",
    critical_blight: "Kritischer Befall",
    moderate_blight: "Mäßiger Befall",
    healthy_plots: "Gesunde Felder",
    switch_language: "Sprache Wählen",
    powered_by_libre: "Übersetzt mit LibreTranslate",
    upload_photo: "Blattfoto Hochladen",
    take_photo: "Foto Aufnehmen",
    drag_drop_text: "Blattfoto hier ablegen oder durchsuchen",
    supported_formats: "Unterstützt PNG, JPG, JPEG",
    sample_specimens: "Musterblätter Testen",
    analyze_button: "KI-Diagnose Starten",
    analyzing_text: "Blattgewebe wird analysiert...",
    confidence_score: "Vertrauensgrad",
    severity_assessment: "Schweregrad",
    recommended_actions: "Empfohlene Maßnahmen",
    chemical_treatments: "Chemische Behandlung",
    organic_remedies: "Biologische Mittel",
    dosage_info: "Empfohlene Dosierung",
    download_pdf: "Zertifikat PDF Herunterladen",
    clear_image: "Bild Löschen",
    healthy_specimen: "Gesundes Blatt",
    early_blight: "Dürrfleckenkrankheit (Early Blight)",
    late_blight: "Kraut- und Knollenfäule (Late Blight)",
    ask_agronomist: "Dr. Flora Agronom fragen",
    type_question: "Fragen zu Dosierung, Fungiziden, Pflanzenschutz...",
    send: "Senden",
  },
  zh: {
    nav_home: "首页",
    nav_scanner: "病害扫描",
    nav_twin: "数字孪生农场",
    nav_radar: "气象雷达",
    nav_dosage: "用药剂量",
    nav_encyclopedia: "病害百科",
    nav_journal: "诊断记录",
    nav_scan_leaf: "扫描叶片",
    system_ready: "系统就绪",
    api_offline: "接口离线",
    tagline: "植物病理智能分析系统",
    hero_title: "AI精准农业与作物病害智能诊断",
    hero_subtitle: "实时神经病害诊断、微气候孢子扩散预警和自主无人机精准植保。",
    start_diagnosis: "开始诊断",
    explore_twin: "探索数字农场",
    dosage_calc: "用药计算器",
    spore_radar: "病菌雷达",
    plant_encyclopedia: "作物百科",
    scan_history: "扫描历史",
    how_it_works: "使用指南",
    select_field: "选择地块",
    send_drone: "无人机喷药",
    water_fields: "开启灌溉",
    simulate_outbreak: "模拟病害爆发",
    reset_farm: "重置农场",
    crop_health: "作物长势",
    disease_risk: "病害风险",
    water_level: "土壤水分",
    photo_view: "卫星影像",
    fullscreen: "全屏模式",
    halfscreen: "半屏模式",
    locate_field: "定位地块",
    spore_radius: "孢子扩散半径",
    pathology_dossier: "地块病理档案",
    crop_variety: "作物品种",
    overall_health: "综合健康度",
    risk_zone: "风险等级",
    gps_coords: "经纬度坐标",
    last_inspected: "最新巡检",
    containment_protocol: "防控方案",
    critical_blight: "严重晚疫病",
    moderate_blight: "中度早疫病",
    healthy_plots: "健康地块",
    switch_language: "选择语言",
    powered_by_libre: "由 LibreTranslate 强力驱动",
    upload_photo: "上传叶片照片",
    take_photo: "实时拍照",
    drag_drop_text: "拖拽叶片照片至此或点击浏览",
    supported_formats: "支持 PNG, JPG, JPEG 格式",
    sample_specimens: "测试样本叶片",
    analyze_button: "启动 AI 智能诊断",
    analyzing_text: "正在分析叶片病理组织...",
    confidence_score: "置信度评分",
    severity_assessment: "病害严重程度",
    recommended_actions: "专家建议措施",
    chemical_treatments: "化学药剂防治",
    organic_remedies: "生物有机防治",
    dosage_info: "推荐用药剂量",
    download_pdf: "下载诊断报告证书 PDF",
    clear_image: "清除图片",
    healthy_specimen: "健康叶片",
    early_blight: "早疫病 (Early Blight)",
    late_blight: "晚疫病 (Late Blight)",
    ask_agronomist: "咨询 Flora 农艺专家",
    type_question: "询问农药配比、灌溉、病害防控...",
    send: "发送",
  },
  ar: {
    nav_home: "الرئيسية",
    nav_scanner: "الماسح الضوئي",
    nav_twin: "المزرعة الرقمية",
    nav_radar: "الرادار",
    nav_dosage: "الجرعات",
    nav_encyclopedia: "الموسوعة",
    nav_journal: "السجل",
    nav_scan_leaf: "مسح الورقة",
    system_ready: "النظام جاهز",
    api_offline: "غير متصل",
    tagline: "نظام تشخيص أمراض النبات",
    hero_title: "الزراعة الدقيقة بالذكاء الاصطناعي وكشف أمراض المحاصيل",
    hero_subtitle: "تشخيص فوري للأمراض وتنبؤ بالجراثيم ودفاع آلي بالطائرات بدون طيار.",
    start_diagnosis: "بدء الفحص",
    explore_twin: "استكشاف المزرعة",
    dosage_calc: "حاسبة الجرعات",
    spore_radar: "رادار الجراثيم",
    plant_encyclopedia: "الموسوعة",
    scan_history: "السجل",
    how_it_works: "كيف يعمل",
    select_field: "حدد الحقل",
    send_drone: "رش بالطائرة المسيرة",
    water_fields: "تشغيل الري",
    simulate_outbreak: "محاكاة انتشار المرض",
    reset_farm: "إعادة ضبط المزرعة",
    crop_health: "صحة المحصول",
    disease_risk: "مخاطر المرض",
    water_level: "مستوى المياه",
    photo_view: "صورة القمر الصناعي",
    fullscreen: "ملء الشاشة",
    halfscreen: "نصف شاشة",
    locate_field: "تحديد الموقع",
    spore_radius: "نطاق العدوى",
    pathology_dossier: "تقرير أمراض الحقل",
    crop_variety: "نوع المحصول",
    overall_health: "الصحة العامة",
    risk_zone: "منطقة الخطر",
    gps_coords: "إحداثيات GPS",
    last_inspected: "آخر فحص",
    containment_protocol: "بروتوكول الاحتواء",
    critical_blight: "لفحة شديدة",
    moderate_blight: "لفحة متوسطة",
    healthy_plots: "حقول سليمة",
    switch_language: "اختر اللغة",
    powered_by_libre: "مترجم بواسطة LibreTranslate",
    upload_photo: "تحميل صورة الورقة",
    take_photo: "التقاط صورة مباشرة",
    drag_drop_text: "اسحب وأفلت صورة الورقة هنا",
    supported_formats: "يدعم صيغ PNG, JPG, JPEG",
    sample_specimens: "تجربة عينات أوراق",
    analyze_button: "تشخيص المرض بالذكاء الاصطناعي",
    analyzing_text: "جاري تحليل أنسجة الورقة...",
    confidence_score: "درجة الدقة",
    severity_assessment: "تقييم شدة الإصابة",
    recommended_actions: "الإجراءات الموصى بها",
    chemical_treatments: "العلاجات الكيميائية",
    organic_remedies: "العلاجات العضوية",
    dosage_info: "الجرعة الموصى بها",
    download_pdf: "تحميل شهادة التشخيص PDF",
    clear_image: "مسح الصورة",
    healthy_specimen: "ورقة سليمة",
    early_blight: "اللفحة المبكرة",
    late_blight: "اللفحة المتأخرة",
    ask_agronomist: "استشر الدكتورة فلورا الخبيرة الزراعية",
    type_question: "اسأل عن المبيدات والجرعات والعناية...",
    send: "إرسال",
  },
  pt: {
    nav_home: "Início",
    nav_scanner: "Scanner",
    nav_twin: "Gêmeo Digital",
    nav_radar: "Radar",
    nav_dosage: "Dosagem",
    nav_encyclopedia: "Enciclopédia",
    nav_journal: "Histórico",
    nav_scan_leaf: "Escanear Folha",
    system_ready: "Sistema Pronto",
    api_offline: "API Offline",
    tagline: "Sistema de Fitopatologia",
    hero_title: "Agronomia de Precisão e Diagnóstico de Doenças com IA",
    hero_subtitle: "Diagnósticos neurais instantâneos, previsão de esporos e defesa autônoma com drones.",
    start_diagnosis: "Iniciar Diagnóstico",
    explore_twin: "Explorar Fazenda",
    dosage_calc: "Calculadora de Dosagem",
    spore_radar: "Radar de Esporos",
    plant_encyclopedia: "Enciclopédia",
    scan_history: "Histórico",
    how_it_works: "Como Funciona",
    select_field: "Selecionar Campo",
    send_drone: "Pulverizar com Drone",
    water_fields: "Irrigar Campos",
    simulate_outbreak: "Simular Surto",
    reset_farm: "Redefinir Fazenda",
    crop_health: "Saúde da Cultura",
    disease_risk: "Risco de Doença",
    water_level: "Nível de Água",
    photo_view: "Visualização Satélite",
    fullscreen: "Tela Cheia",
    halfscreen: "Meia Tela",
    locate_field: "Localizar Campo",
    spore_radius: "Raio de Esporos",
    pathology_dossier: "Dossiê Fitopatológico",
    crop_variety: "Variedade da Cultura",
    overall_health: "Saúde Geral",
    risk_zone: "Zona de Risco",
    gps_coords: "Coordenadas GPS",
    last_inspected: "Última Inspeção",
    containment_protocol: "Protocolo de Contenção",
    critical_blight: "Requeima Crítica",
    moderate_blight: "Pinta Preta Moderada",
    healthy_plots: "Campos Saudáveis",
    switch_language: "Selecionar Idioma",
    powered_by_libre: "Traduzido com LibreTranslate",
    upload_photo: "Enviar Foto da Folha",
    take_photo: "Tirar Foto ao Vivo",
    drag_drop_text: "Arraste e solte a imagem da folha aqui",
    supported_formats: "Suporta PNG, JPG, JPEG",
    sample_specimens: "Testar Folhas de Amostra",
    analyze_button: "Executar Diagnóstico IA",
    analyzing_text: "Analisando tecido foliar...",
    confidence_score: "Pontuação de Confiança",
    severity_assessment: "Avaliação de Gravidade",
    recommended_actions: "Ações Recomendadas",
    chemical_treatments: "Tratamentos Químicos",
    organic_remedies: "Remédios Orgânicos",
    dosage_info: "Dosagem Recomendada",
    download_pdf: "Baixar Certificado PDF",
    clear_image: "Limpar Imagem",
    healthy_specimen: "Folha Saudável",
    early_blight: "Pinta Preta (Early Blight)",
    late_blight: "Requeima (Late Blight)",
    ask_agronomist: "Perguntar à Dra. Flora",
    type_question: "Pergunte sobre defensivos, dosagens e manejo...",
    send: "Enviar",
  },
};

// Map of original English text stored for DOM nodes
const nodeOriginalTextMap = new WeakMap();

// Cache of dynamic translations across the application session
const memoryTranslationCache = new Map();

// Helper to check if string contains translatable letters
const isTranslatableString = (str) => {
  if (!str || typeof str !== "string") return false;
  const trimmed = str.trim();
  if (trimmed.length < 2) return false;
  // Ignore pure numbers, times, percentages, GPS coords, technical tags
  if (/^[\d\s.,:%°/+\-–—()#№<>$€₹\u2190-\u2193\u2194\u2196-\u2199\u21a9\u21aa\u21b0-\u21b5\u25b2\u25bc\u25c0\u25b6•|*&^~@!?]+$/.test(trimmed)) {
    return false;
  }
  // Ignore css class names, code-like identifiers
  if (/^[A-Za-z0-9_-]+\.[a-z]+$/.test(trimmed)) return false;
  if (/^#?[0-9a-fA-F]{3,8}$/.test(trimmed)) return false;
  return true;
};

const LanguageContext = createContext(null);

export const LanguageProvider = ({ children }) => {
  const [currentLang, setCurrentLang] = useState(() => {
    return localStorage.getItem("agropath_language") || "en";
  });
  const [isTranslating, setIsTranslating] = useState(false);
  const isTranslatingRef = useRef(false);
  const pendingBatch = useRef(new Set());
  const batchTimeout = useRef(null);

  // Sync HTML lang and dir attributes
  useEffect(() => {
    document.documentElement.lang = currentLang;
    document.documentElement.dir = currentLang === "ar" ? "rtl" : "ltr";
    localStorage.setItem("agropath_language", currentLang);
  }, [currentLang]);

  // Synchronous Key Translation
  const t = useCallback(
    (key, fallback = "") => {
      const langDict = UI_DICTIONARY[currentLang];
      if (langDict && langDict[key]) {
        return langDict[key];
      }
      const enDict = UI_DICTIONARY.en;
      if (enDict && enDict[key]) {
        return enDict[key];
      }
      return fallback || key;
    },
    [currentLang]
  );

  // Request batch translation from LibreTranslate API with public mirrors fallback
  const fetchLibreBatch = useCallback(
    async (texts, targetLang) => {
      if (!texts.length || targetLang === "en") return {};
      const results = {};
      const needed = [];

      texts.forEach((text) => {
        const cacheKey = `${targetLang}_${text.trim()}`;
        if (memoryTranslationCache.has(cacheKey)) {
          results[text] = memoryTranslationCache.get(cacheKey);
        } else {
          // Check local dictionary reverse search
          let foundInDict = null;
          for (const [k, enVal] of Object.entries(UI_DICTIONARY.en)) {
            if (enVal.trim().toLowerCase() === text.trim().toLowerCase()) {
              if (UI_DICTIONARY[targetLang] && UI_DICTIONARY[targetLang][k]) {
                foundInDict = UI_DICTIONARY[targetLang][k];
                break;
              }
            }
          }
          if (foundInDict) {
            memoryTranslationCache.set(cacheKey, foundInDict);
            results[text] = foundInDict;
          } else {
            needed.push(text);
          }
        }
      });

      if (!needed.length) return results;

      try {
        // First try backend proxy /api/translate
        const res = await fetch(`${API_BASE_URL}/api/translate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            q: needed,
            source: "en",
            target: targetLang,
            format: "text",
          }),
        });

        if (res.ok) {
          const data = await res.json();
          const translatedList = data.translatedTexts || (data.translatedText ? [data.translatedText] : []);
          needed.forEach((orig, idx) => {
            const trans = translatedList[idx] || orig;
            const cacheKey = `${targetLang}_${orig.trim()}`;
            memoryTranslationCache.set(cacheKey, trans);
            results[orig] = trans;
          });
          return results;
        }
      } catch (err) {
        // Try direct LibreTranslate mirror fallback if backend proxy not available
        try {
          for (const text of needed.slice(0, 15)) {
            const mirrorRes = await fetch("https://translate.argosopentech.com/translate", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                q: text,
                source: "en",
                target: targetLang,
                format: "text",
              }),
            });
            if (mirrorRes.ok) {
              const mData = await mirrorRes.json();
              const trans = mData.translatedText || text;
              const cacheKey = `${targetLang}_${text.trim()}`;
              memoryTranslationCache.set(cacheKey, trans);
              results[text] = trans;
            }
          }
        } catch (mErr) {
          console.warn("LibreTranslate mirror fallback note:", mErr);
        }
      }

      return results;
    },
    []
  );

  // Dynamic DOM Translation Engine
  useEffect(() => {
    if (currentLang === "en") {
      // Revert all DOM text nodes back to original English
      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        null,
        false
      );
      let node;
      while ((node = walker.nextNode())) {
        if (nodeOriginalTextMap.has(node)) {
          const orig = nodeOriginalTextMap.get(node);
          if (node.nodeValue !== orig) {
            node.nodeValue = orig;
          }
        }
      }
      return;
    }

    const processAllDomTextNodes = async () => {
      const textsToTranslate = new Set();
      const nodeQueue = [];

      const walker = document.createTreeWalker(
        document.body,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (n) => {
            const parent = n.parentElement;
            if (!parent) return NodeFilter.FILTER_REJECT;
            const tag = parent.tagName.toLowerCase();
            if (
              tag === "script" ||
              tag === "style" ||
              tag === "code" ||
              tag === "pre" ||
              tag === "svg" ||
              tag === "path"
            ) {
              return NodeFilter.FILTER_REJECT;
            }
            if (parent.closest(".language-dropdown-menu") || parent.closest(".lang-flag-preview")) {
              return NodeFilter.FILTER_REJECT;
            }
            return NodeFilter.FILTER_ACCEPT;
          },
        },
        false
      );

      let textNode;
      while ((textNode = walker.nextNode())) {
        let original = nodeOriginalTextMap.get(textNode);
        if (original === undefined) {
          original = textNode.nodeValue;
          nodeOriginalTextMap.set(textNode, original);
        }

        const trimmed = original.trim();
        if (isTranslatableString(trimmed)) {
          nodeQueue.push({ node: textNode, original, trimmed });
          textsToTranslate.add(trimmed);
        }
      }

      // Also translate input and textarea placeholders
      const inputs = document.querySelectorAll("input[placeholder], textarea[placeholder]");
      inputs.forEach((input) => {
        let origPlaceholder = input.getAttribute("data-orig-placeholder");
        if (!origPlaceholder) {
          origPlaceholder = input.getAttribute("placeholder");
          input.setAttribute("data-orig-placeholder", origPlaceholder);
        }
        if (isTranslatableString(origPlaceholder)) {
          textsToTranslate.add(origPlaceholder.trim());
        }
      });

      if (!textsToTranslate.size) return;

      // Translate dictionary matches immediately
      nodeQueue.forEach(({ node, original, trimmed }) => {
        const cacheKey = `${currentLang}_${trimmed}`;
        let translated = memoryTranslationCache.get(cacheKey);

        if (!translated) {
          // Check dictionary
          for (const [k, enVal] of Object.entries(UI_DICTIONARY.en)) {
            if (enVal.trim().toLowerCase() === trimmed.toLowerCase()) {
              if (UI_DICTIONARY[currentLang] && UI_DICTIONARY[currentLang][k]) {
                translated = UI_DICTIONARY[currentLang][k];
                memoryTranslationCache.set(cacheKey, translated);
                break;
              }
            }
          }
        }

        if (translated) {
          const leadingSpace = original.match(/^\s*/)[0];
          const trailingSpace = original.match(/\s*$/)[0];
          node.nodeValue = leadingSpace + translated + trailingSpace;
        }
      });

      // Fetch dynamic translations via LibreTranslate
      const unCached = Array.from(textsToTranslate).filter(
        (t) => !memoryTranslationCache.has(`${currentLang}_${t}`)
      );

      if (unCached.length > 0) {
        setIsTranslating(true);
        const fetched = await fetchLibreBatch(unCached, currentLang);
        setIsTranslating(false);

        // Apply newly translated strings to DOM
        nodeQueue.forEach(({ node, original, trimmed }) => {
          const trans = fetched[trimmed];
          if (trans) {
            const leadingSpace = original.match(/^\s*/)[0];
            const trailingSpace = original.match(/\s*$/)[0];
            node.nodeValue = leadingSpace + trans + trailingSpace;
          }
        });

        // Apply to placeholders
        inputs.forEach((input) => {
          const orig = input.getAttribute("data-orig-placeholder");
          if (orig) {
            const trans = fetched[orig.trim()] || memoryTranslationCache.get(`${currentLang}_${orig.trim()}`);
            if (trans) {
              input.setAttribute("placeholder", trans);
            }
          }
        });
      }
    };

    // Initial translation pass
    processAllDomTextNodes();

    // Observe DOM updates for newly mounted components, tabs, modals
    const observer = new MutationObserver((mutations) => {
      let shouldProcess = false;
      for (const m of mutations) {
        if (m.type === "childList" && m.addedNodes.length > 0) {
          shouldProcess = true;
          break;
        }
      }
      if (shouldProcess) {
        if (batchTimeout.current) clearTimeout(batchTimeout.current);
        batchTimeout.current = setTimeout(() => {
          processAllDomTextNodes();
        }, 120);
      }
    });

    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      if (batchTimeout.current) clearTimeout(batchTimeout.current);
    };
  }, [currentLang, fetchLibreBatch]);

  // Dynamic Single Text Translation helper
  const translateWithLibre = useCallback(
    async (text, targetLanguage = currentLang) => {
      if (!text || typeof text !== "string" || !text.trim()) return text;
      if (targetLanguage === "en") return text;

      const cacheKey = `${targetLanguage}_${text.trim()}`;
      if (memoryTranslationCache.has(cacheKey)) {
        return memoryTranslationCache.get(cacheKey);
      }

      const res = await fetchLibreBatch([text.trim()], targetLanguage);
      return res[text.trim()] || text;
    },
    [currentLang, fetchLibreBatch]
  );

  const changeLanguage = (langCode) => {
    const found = SUPPORTED_LANGUAGES.find((l) => l.code === langCode);
    if (found) {
      setCurrentLang(langCode);
    }
  };

  const activeLanguageObj =
    SUPPORTED_LANGUAGES.find((l) => l.code === currentLang) || SUPPORTED_LANGUAGES[0];

  return (
    <LanguageContext.Provider
      value={{
        currentLang,
        activeLanguageObj,
        languages: SUPPORTED_LANGUAGES,
        changeLanguage,
        t,
        translateWithLibre,
        isTranslating,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error("useTranslation must be used within a LanguageProvider");
  }
  return context;
};
