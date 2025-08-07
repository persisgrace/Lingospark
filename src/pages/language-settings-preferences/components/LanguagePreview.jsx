import React from 'react';
import Icon from '../../../components/AppIcon';

const LanguagePreview = ({ selectedLanguage }) => {
  const previewTexts = {
    en: {
      greeting: "Hello! How can I help you today?",
      sample: "This is a sample text to demonstrate font rendering and text display for the selected language.",
      direction: "ltr"
    },
    ko: {
      greeting: "안녕하세요! 오늘 어떻게 도와드릴까요?",
      sample: "선택한 언어의 글꼴 렌더링과 텍스트 표시를 보여주는 샘플 텍스트입니다.",
      direction: "ltr"
    },
    ja: {
      greeting: "こんにちは！今日はどのようにお手伝いできますか？",
      sample: "これは選択した言語のフォントレンダリングとテキスト表示を示すサンプルテキストです。",
      direction: "ltr"
    },
    ru: {
      greeting: "Привет! Как я могу помочь вам сегодня?",
      sample: "Это образец текста для демонстрации рендеринга шрифтов и отображения текста для выбранного языка.",
      direction: "ltr"
    },
    tr: {
      greeting: "Merhaba! Bugün size nasıl yardımcı olabilirim?",
      sample: "Bu, seçilen dil için yazı tipi oluşturma ve metin görüntülemeyi göstermek için örnek bir metindir.",
      direction: "ltr"
    },
    ar: {
      greeting: "مرحبا! كيف يمكنني مساعدتك اليوم؟",
      sample: "هذا نص تجريبي لإظهار عرض الخط والنص للغة المحددة.",
      direction: "rtl"
    },
    zh: {
      greeting: "你好！今天我能为您做些什么？",
      sample: "这是一个示例文本，用于演示所选语言的字体渲染和文本显示。",
      direction: "ltr"
    },
    hi: {
      greeting: "नमस्ते! आज मैं आपकी कैसे सहायता कर सकता हूँ?",
      sample: "यह चयनित भाषा के लिए फ़ॉन्ट रेंडरिंग और टेक्स्ट डिस्प्ले को प्रदर्शित करने के लिए एक नमूना टेक्स्ट है।",
      direction: "ltr"
    }
  };

  const currentPreview = previewTexts?.[selectedLanguage] || previewTexts?.en;

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-center space-x-2 mb-4">
        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
          <Icon name="Eye" size={16} className="text-primary" />
        </div>
        <h3 className="text-lg font-semibold text-foreground">Language Preview</h3>
      </div>
      <div className="space-y-4">
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">Greeting Example:</p>
          <p 
            className="text-lg font-medium text-foreground"
            dir={currentPreview?.direction}
          >
            {currentPreview?.greeting}
          </p>
        </div>

        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground mb-2">Sample Text:</p>
          <p 
            className="text-foreground leading-relaxed"
            dir={currentPreview?.direction}
          >
            {currentPreview?.sample}
          </p>
        </div>

        <div className="flex items-center justify-between p-3 bg-accent rounded-lg">
          <div className="flex items-center space-x-2">
            <Icon name="Info" size={16} className="text-muted-foreground" />
            <span className="text-sm text-muted-foreground">Text Direction:</span>
          </div>
          <span className="text-sm font-medium text-foreground uppercase">
            {currentPreview?.direction}
          </span>
        </div>
      </div>
    </div>
  );
};

export default LanguagePreview;