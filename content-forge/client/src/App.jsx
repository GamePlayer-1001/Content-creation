import React, { useState, useCallback } from 'react';
import Header from './components/Header.jsx';
import ConfigModal from './components/ConfigModal.jsx';
import InputPanel from './components/InputPanel.jsx';
import EditorPanel from './components/EditorPanel.jsx';
import PreviewSimulator from './components/PreviewSimulator.jsx';
import ImagePanel from './components/ImagePanel.jsx';
import ExportPanel from './components/ExportPanel.jsx';

const STEPS = ['input', 'editor', 'image', 'preview', 'export'];
const STEP_LABELS = {
  input: '输入主题',
  editor: '编辑润色',
  image: '配图',
  preview: '预览排版',
  export: '导出保存',
};

export default function App() {
  const [step, setStep] = useState('input');
  const [draft, setDraft] = useState('');
  const [platformVersions, setPlatformVersions] = useState({});
  const [activePlatform, setActivePlatform] = useState('wechat');
  const [images, setImages] = useState([]);
  const [topic, setTopic] = useState('');
  const [generating, setGenerating] = useState(false);
  const [configOpen, setConfigOpen] = useState(false);

  const currentContent = platformVersions[activePlatform] || draft;

  const handleDraftGenerated = useCallback((content) => {
    setDraft(content);
    setStep('editor');
  }, []);

  const handlePlatformAdapted = useCallback((platform, content) => {
    setPlatformVersions(prev => ({ ...prev, [platform]: content }));
  }, []);

  const handleContentUpdate = useCallback((content) => {
    if (platformVersions[activePlatform]) {
      setPlatformVersions(prev => ({ ...prev, [activePlatform]: content }));
    } else {
      setDraft(content);
    }
  }, [activePlatform, platformVersions]);

  return (
    <div className="h-screen flex flex-col bg-[var(--bg-primary)]">
      <Header
        step={step}
        steps={STEPS}
        labels={STEP_LABELS}
        onStepChange={setStep}
        hasDraft={!!draft}
        onOpenConfig={() => setConfigOpen(true)}
      />
      <ConfigModal open={configOpen} onClose={() => setConfigOpen(false)} />
      <main className="flex-1 overflow-hidden">
        {step === 'input' && (
          <InputPanel
            topic={topic}
            setTopic={setTopic}
            generating={generating}
            setGenerating={setGenerating}
            onDraftGenerated={handleDraftGenerated}
          />
        )}
        {step === 'editor' && (
          <EditorPanel
            draft={draft}
            platformVersions={platformVersions}
            activePlatform={activePlatform}
            setActivePlatform={setActivePlatform}
            onContentUpdate={handleContentUpdate}
            onPlatformAdapted={handlePlatformAdapted}
            generating={generating}
            setGenerating={setGenerating}
          />
        )}
        {step === 'image' && (
          <ImagePanel
            content={currentContent}
            images={images}
            setImages={setImages}
          />
        )}
        {step === 'preview' && (
          <PreviewSimulator
            content={currentContent}
            platform={activePlatform}
            onPlatformChange={setActivePlatform}
            images={images}
            onContentUpdate={handleContentUpdate}
          />
        )}
        {step === 'export' && (
          <ExportPanel
            title={topic}
            content={currentContent}
            platform={activePlatform}
            platformVersions={platformVersions}
            draft={draft}
          />
        )}
      </main>
    </div>
  );
}
