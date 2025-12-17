'use client';

import React, { useState, useCallback } from 'react';
import { 
  Sun, Moon, Download, Copy, Check, Palette, Type, Maximize2, 
  Layers, Box, FileCode, Bell, Plus, Heart, Zap, Home, Settings, User, Mail,
  ChevronRight, Info, AlertTriangle
} from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { Button } from '@/components/ui/button';
import { Input, SearchInput, Textarea } from '@/components/ui/input';
import { Checkbox, CheckboxGroup, RadioGroup, RadioGroupItem } from '@/components/ui/checkbox';
import { Switch } from '@/components/ui/switch';
import { Chip, Badge, BadgeWrapper } from '@/components/ui/chip';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Avatar, AvatarGroup } from '@/components/ui/avatar';
import { SelectField, SelectItem, SelectGroup, SelectLabel, SelectSeparator } from '@/components/ui/select';
import { Modal } from '@/components/ui/dialog';
import { Toast, ToastContainer } from '@/components/ui/toast';
import { Tooltip } from '@/components/ui/tooltip';
import { Progress, CircularProgress, Spinner } from '@/components/ui/progress';
import { SimpleAccordion } from '@/components/ui/accordion';
import { SimpleTabs } from '@/components/ui/tabs';
import { SidePanel } from '@/components/ui/drawer';
import { Breadcrumb } from '@/components/ui/breadcrumb';
import { Pagination, SimplePagination, CompactPagination } from '@/components/ui/pagination';
import { createDesignTokens, type ColorScale } from '@/lib/tokens';
import { exportToCSS, exportToTailwind, exportToFigmaJSON, exportToTypeScript } from '@/lib/export';

const navItems = [
  { id: 'colors', label: 'Colors', icon: Palette },
  { id: 'typography', label: 'Typography', icon: Type },
  { id: 'spacing', label: 'Spacing', icon: Maximize2 },
  { id: 'elevation', label: 'Elevation', icon: Layers },
  { id: 'components', label: 'Components', icon: Box },
  { id: 'export', label: 'Export', icon: FileCode },
];

function ColorPicker({ label, value, onChange }: { label: string; value: string; onChange: (c: string) => void }) {
  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-neutral-700 dark:text-neutral-300">{label}</label>
      <div className="flex items-center gap-3">
        <input type="color" value={value} onChange={(e) => onChange(e.target.value)} 
          className="w-12 h-12 rounded-lg cursor-pointer border-2 border-neutral-200 dark:border-neutral-700" />
        <Input size="sm" value={value.toUpperCase()} onChange={(e) => onChange(e.target.value)} className="w-28 font-mono" />
      </div>
    </div>
  );
}

function ColorScaleDisplay({ name, scale }: { name: string; scale: ColorScale }) {
  const [copiedShade, setCopiedShade] = useState<string | null>(null);
  const copyColor = (shade: string, color: string) => {
    navigator.clipboard.writeText(color);
    setCopiedShade(shade);
    setTimeout(() => setCopiedShade(null), 1500);
  };
  return (
    <div className="flex flex-col gap-2">
      <h4 className="text-sm font-semibold text-neutral-900 dark:text-neutral-100 capitalize">{name}</h4>
      <div className="flex gap-1">
        {Object.entries(scale).map(([shade, color]) => (
          <button key={shade} onClick={() => copyColor(shade, color)}
            className="group relative flex-1 h-12 rounded-md transition-transform hover:scale-105 hover:z-10"
            style={{ backgroundColor: color }} title={`${shade}: ${color}`}>
            <span className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
              {copiedShade === shade ? <Check className="size-4 text-white drop-shadow-md" /> : <Copy className="size-4 text-white drop-shadow-md" />}
            </span>
          </button>
        ))}
      </div>
      <div className="flex gap-1 text-[10px] text-neutral-500 dark:text-neutral-400">
        {Object.keys(scale).map((shade) => <span key={shade} className="flex-1 text-center">{shade}</span>)}
      </div>
    </div>
  );
}

function CodePreview({ code, filename }: { code: string; filename: string }) {
  const [copied, setCopied] = useState(false);
  const copyCode = () => { navigator.clipboard.writeText(code); setCopied(true); setTimeout(() => setCopied(false), 2000); };
  return (
    <div className="rounded-xl overflow-hidden border border-neutral-200 dark:border-neutral-800">
      <div className="flex items-center justify-between px-4 py-2 bg-neutral-100 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
        <span className="text-sm font-medium text-neutral-600 dark:text-neutral-400">{filename}</span>
        <Button size="sm" variant="ghost" onClick={copyCode}>
          {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
          {copied ? 'Copied!' : 'Copy'}
        </Button>
      </div>
      <pre className="p-4 bg-neutral-50 dark:bg-neutral-950 overflow-x-auto max-h-96">
        <code className="text-sm font-mono text-neutral-800 dark:text-neutral-200">{code}</code>
      </pre>
    </div>
  );
}

export default function DesignSystemPage() {
  const { resolvedTheme, setTheme } = useTheme();
  const [activeSection, setActiveSection] = useState('colors');
  const [primaryColor, setPrimaryColor] = useState('#2563eb');
  const [secondaryColor, setSecondaryColor] = useState('#7c3aed');
  const [accentColor, setAccentColor] = useState('#06b6d4');
  const [exportFormat, setExportFormat] = useState<'css' | 'tailwind' | 'figma' | 'typescript'>('css');
  const [modalOpen, setModalOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  
  const tokens = createDesignTokens({ primary: primaryColor, secondary: secondaryColor, accent: accentColor });

  const getExportCode = useCallback(() => {
    switch (exportFormat) {
      case 'css': return exportToCSS(tokens);
      case 'tailwind': return exportToTailwind(tokens);
      case 'figma': return exportToFigmaJSON(tokens);
      case 'typescript': return exportToTypeScript(tokens);
    }
  }, [exportFormat, tokens]);

  const downloadAll = useCallback(() => {
    const files = [
      { name: 'design-tokens.css', content: exportToCSS(tokens) },
      { name: 'tailwind.config.ts', content: exportToTailwind(tokens) },
      { name: 'figma-variables.json', content: exportToFigmaJSON(tokens) },
      { name: 'theme.ts', content: exportToTypeScript(tokens) },
    ];
    files.forEach((file) => {
      const blob = new Blob([file.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = file.name;
      a.click();
      URL.revokeObjectURL(url);
    });
  }, [tokens]);

  const downloadCurrent = useCallback(() => {
    const extensions: Record<string, string> = { css: 'css', tailwind: 'ts', figma: 'json', typescript: 'ts' };
    const blob = new Blob([getExportCode()], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `design-tokens.${extensions[exportFormat]}`;
    a.click();
    URL.revokeObjectURL(url);
  }, [exportFormat, getExportCode]);

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950">
      {showToast && (
        <ToastContainer position="top-right">
          <Toast variant="success" title="Success!" description="Your action was completed." onClose={() => setShowToast(false)} duration={3000} showProgress />
        </ToastContainer>
      )}
      
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-secondary-500 flex items-center justify-center">
              <Layers className="size-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-neutral-900 dark:text-neutral-100">Design System</span>
            <Chip variant="outline" color="primary" size="sm">v1.0</Chip>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" iconOnly onClick={() => setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')}>
              {resolvedTheme === 'dark' ? <Sun className="size-5" /> : <Moon className="size-5" />}
            </Button>
            <Button variant="primary" size="sm" leftIcon={<Download className="size-4" />} onClick={downloadAll}>Export All</Button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          <aside className="w-56 flex-shrink-0">
            <nav className="sticky top-24 flex flex-col gap-1">
              {navItems.map((item) => (
                <button key={item.id} onClick={() => setActiveSection(item.id)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    activeSection === item.id ? 'bg-primary-50 text-primary-600 dark:bg-primary-950 dark:text-primary-400'
                    : 'text-neutral-600 hover:bg-neutral-100 dark:text-neutral-400 dark:hover:bg-neutral-800'
                  }`}>
                  <item.icon className="size-5" />{item.label}
                </button>
              ))}
            </nav>
          </aside>

          <main className="flex-1 min-w-0">
            {activeSection === 'colors' && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">Colors</h1>
                  <p className="mt-2 text-neutral-600 dark:text-neutral-400">Customize brand colors and generate complete scales with WCAG-compliant contrast.</p>
                </div>
                <Card>
                  <CardHeader><CardTitle>Brand Colors</CardTitle><CardDescription>Adjust colors to generate complete scales.</CardDescription></CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-6">
                      <ColorPicker label="Primary" value={primaryColor} onChange={setPrimaryColor} />
                      <ColorPicker label="Secondary" value={secondaryColor} onChange={setSecondaryColor} />
                      <ColorPicker label="Accent" value={accentColor} onChange={setAccentColor} />
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle>Color Scales</CardTitle><CardDescription>Full 50-950 scales with dark mode variants.</CardDescription></CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <ColorScaleDisplay name="Primary" scale={tokens.colors.primary} />
                      <ColorScaleDisplay name="Secondary" scale={tokens.colors.secondary} />
                      <ColorScaleDisplay name="Accent" scale={tokens.colors.accent} />
                      <ColorScaleDisplay name="Neutral" scale={tokens.colors.neutral} />
                      <ColorScaleDisplay name="Success" scale={tokens.colors.success} />
                      <ColorScaleDisplay name="Warning" scale={tokens.colors.warning} />
                      <ColorScaleDisplay name="Error" scale={tokens.colors.error} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === 'typography' && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">Typography</h1>
                  <p className="mt-2 text-neutral-600 dark:text-neutral-400">Type scale with semantic naming using Inter font family.</p>
                </div>
                <Card>
                  <CardHeader><CardTitle>Display Styles</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(tokens.typography.display).map(([name, style]) => (
                      <div key={name} className="flex items-baseline justify-between py-3 border-b border-neutral-200 dark:border-neutral-800">
                        <span style={{ fontSize: style.fontSize, lineHeight: style.lineHeight, letterSpacing: style.letterSpacing, fontWeight: style.fontWeight }}
                          className="text-neutral-900 dark:text-neutral-100">Display {name}</span>
                        <span className="text-xs text-neutral-500 font-mono">{style.fontSize} / {style.fontWeight}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle>Heading Styles</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    {Object.entries(tokens.typography.heading).map(([name, style]) => (
                      <div key={name} className="flex items-baseline justify-between py-3 border-b border-neutral-200 dark:border-neutral-800">
                        <span style={{ fontSize: style.fontSize, lineHeight: style.lineHeight, letterSpacing: style.letterSpacing, fontWeight: style.fontWeight }}
                          className="text-neutral-900 dark:text-neutral-100">{name.toUpperCase()}</span>
                        <span className="text-xs text-neutral-500 font-mono">{style.fontSize} / {style.fontWeight}</span>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === 'spacing' && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">Spacing</h1>
                  <p className="mt-2 text-neutral-600 dark:text-neutral-400">8px-based spacing scale with semantic tokens.</p>
                </div>
                <Card>
                  <CardHeader><CardTitle>Spacing Scale</CardTitle></CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(tokens.spacing).map(([key, value]) => (
                        <div key={key} className="flex items-center gap-4">
                          <span className="w-12 text-sm font-mono text-neutral-500 dark:text-neutral-400">{key}</span>
                          <div className="h-6 bg-primary-500 rounded" style={{ width: value }} />
                          <span className="text-sm text-neutral-600 dark:text-neutral-300">{value}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === 'elevation' && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">Elevation</h1>
                  <p className="mt-2 text-neutral-600 dark:text-neutral-400">5 elevation levels with light and dark mode shadows.</p>
                </div>
                <Card>
                  <CardHeader><CardTitle>Shadow Levels</CardTitle></CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-5 gap-4">
                      {Object.entries(tokens.elevation).map(([level, shadows]) => (
                        <div key={level} className="w-full h-24 rounded-xl bg-white dark:bg-neutral-800 flex items-center justify-center"
                          style={{ boxShadow: resolvedTheme === 'dark' ? shadows.dark : shadows.light }}>
                          <span className="text-sm font-medium text-neutral-600 dark:text-neutral-300">Level {level}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === 'components' && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">Components</h1>
                  <p className="mt-2 text-neutral-600 dark:text-neutral-400">Live preview of all 18 component categories.</p>
                </div>

                {/* Buttons */}
                <Card>
                  <CardHeader><CardTitle>Buttons</CardTitle></CardHeader>
                  <CardContent className="space-y-6">
                    <div className="flex flex-wrap gap-3">
                      <Button variant="primary">Primary</Button>
                      <Button variant="secondary">Secondary</Button>
                      <Button variant="tertiary">Tertiary</Button>
                      <Button variant="ghost">Ghost</Button>
                      <Button variant="outline">Outline</Button>
                      <Button variant="destructive">Destructive</Button>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button size="sm">Small</Button>
                      <Button size="md">Medium</Button>
                      <Button size="lg">Large</Button>
                      <Button leftIcon={<Plus className="size-4" />}>With Icon</Button>
                      <Button loading>Loading</Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Inputs */}
                <Card>
                  <CardHeader><CardTitle>Inputs</CardTitle></CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <Input label="Default" placeholder="Enter text..." />
                      <Input label="Error State" errorMessage="This field is required" />
                      <SearchInput placeholder="Search..." />
                      <Input label="With Count" maxLength={50} showCharacterCount />
                    </div>
                    <Textarea label="Textarea" placeholder="Enter message..." />
                  </CardContent>
                </Card>

                {/* Selection */}
                <Card>
                  <CardHeader><CardTitle>Selection Controls</CardTitle></CardHeader>
                  <CardContent className="space-y-6">
                    <CheckboxGroup>
                      <Checkbox label="Option 1" defaultChecked />
                      <Checkbox label="Option 2" />
                      <Checkbox label="Indeterminate" indeterminate />
                    </CheckboxGroup>
                    <RadioGroup defaultValue="opt1">
                      <RadioGroupItem value="opt1" label="Radio 1" />
                      <RadioGroupItem value="opt2" label="Radio 2" />
                    </RadioGroup>
                    <div className="flex gap-6">
                      <Switch label="Toggle" defaultChecked />
                      <Switch size="sm" />
                      <Switch size="lg" />
                    </div>
                  </CardContent>
                </Card>

                {/* Select */}
                <Card>
                  <CardHeader><CardTitle>Select / Dropdown</CardTitle></CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-6">
                      <SelectField label="Basic Select" placeholder="Choose option">
                        <SelectItem value="1">Option 1</SelectItem>
                        <SelectItem value="2">Option 2</SelectItem>
                        <SelectItem value="3">Option 3</SelectItem>
                      </SelectField>
                      <SelectField label="With Groups" placeholder="Select">
                        <SelectGroup>
                          <SelectLabel>Group A</SelectLabel>
                          <SelectItem value="a1">Item A1</SelectItem>
                          <SelectItem value="a2">Item A2</SelectItem>
                        </SelectGroup>
                        <SelectSeparator />
                        <SelectGroup>
                          <SelectLabel>Group B</SelectLabel>
                          <SelectItem value="b1">Item B1</SelectItem>
                        </SelectGroup>
                      </SelectField>
                    </div>
                  </CardContent>
                </Card>

                {/* Chips & Badges */}
                <Card>
                  <CardHeader><CardTitle>Chips & Badges</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex flex-wrap gap-2">
                      <Chip variant="solid" color="primary">Primary</Chip>
                      <Chip variant="subtle" color="success" statusDot>Active</Chip>
                      <Chip variant="outline" color="warning">Warning</Chip>
                      <Chip variant="subtle" color="neutral" dismissible onDismiss={() => {}}>Dismissible</Chip>
                    </div>
                    <div className="flex items-center gap-6">
                      <BadgeWrapper badge={<Badge variant="count" color="error" count={5} />}>
                        <Button variant="ghost" iconOnly><Bell className="size-5" /></Button>
                      </BadgeWrapper>
                      <Badge variant="dot" color="success" />
                      <Badge variant="text" color="primary">New</Badge>
                    </div>
                  </CardContent>
                </Card>

                {/* Cards */}
                <Card>
                  <CardHeader><CardTitle>Cards</CardTitle></CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-3 gap-4">
                      <Card variant="default"><CardContent className="pt-6">Default</CardContent></Card>
                      <Card variant="elevated"><CardContent className="pt-6">Elevated</CardContent></Card>
                      <Card variant="outlined" interactive><CardContent className="pt-6">Interactive</CardContent></Card>
                    </div>
                  </CardContent>
                </Card>

                {/* Avatars */}
                <Card>
                  <CardHeader><CardTitle>Avatars</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-end gap-3">
                      <Avatar size="sm" fallback="SM" />
                      <Avatar size="md" fallback="MD" status="online" />
                      <Avatar size="lg" fallback="LG" status="busy" />
                    </div>
                    <AvatarGroup max={3}>
                      <Avatar fallback="A" /><Avatar fallback="B" /><Avatar fallback="C" /><Avatar fallback="D" />
                    </AvatarGroup>
                  </CardContent>
                </Card>

                {/* Tooltips */}
                <Card>
                  <CardHeader><CardTitle>Tooltips</CardTitle></CardHeader>
                  <CardContent>
                    <div className="flex gap-4">
                      <Tooltip content="Top tooltip" side="top"><Button variant="outline">Top</Button></Tooltip>
                      <Tooltip content="Right tooltip" side="right"><Button variant="outline">Right</Button></Tooltip>
                      <Tooltip content="Bottom tooltip" side="bottom"><Button variant="outline">Bottom</Button></Tooltip>
                      <Tooltip content="Left tooltip" side="left"><Button variant="outline">Left</Button></Tooltip>
                    </div>
                  </CardContent>
                </Card>

                {/* Progress */}
                <Card>
                  <CardHeader><CardTitle>Progress Indicators</CardTitle></CardHeader>
                  <CardContent className="space-y-6">
                    <Progress value={65} showLabel label="Linear Progress" />
                    <Progress value={100} color="success" size="lg" indeterminate />
                    <div className="flex items-center gap-6">
                      <CircularProgress value={75} showLabel />
                      <CircularProgress indeterminate color="secondary" />
                      <Spinner size="md" />
                    </div>
                  </CardContent>
                </Card>

                {/* Tabs */}
                <Card>
                  <CardHeader><CardTitle>Tabs</CardTitle></CardHeader>
                  <CardContent>
                    <SimpleTabs 
                      variant="pills"
                      items={[
                        { value: 'tab1', label: 'Account', icon: <User className="size-4" />, content: <p className="text-neutral-600 dark:text-neutral-400 py-2">Account settings content.</p> },
                        { value: 'tab2', label: 'Security', icon: <Settings className="size-4" />, content: <p className="text-neutral-600 dark:text-neutral-400 py-2">Security settings content.</p> },
                        { value: 'tab3', label: 'Notifications', icon: <Bell className="size-4" />, content: <p className="text-neutral-600 dark:text-neutral-400 py-2">Notification preferences.</p> },
                      ]}
                    />
                  </CardContent>
                </Card>

                {/* Accordion */}
                <Card>
                  <CardHeader><CardTitle>Accordion</CardTitle></CardHeader>
                  <CardContent>
                    <SimpleAccordion
                      variant="separated"
                      items={[
                        { id: '1', title: 'What is a design system?', content: 'A design system is a collection of reusable components and guidelines.' },
                        { id: '2', title: 'How do I use these tokens?', content: 'Export to your preferred format and integrate with your project.' },
                        { id: '3', title: 'Is dark mode supported?', content: 'Yes! All components work seamlessly in both light and dark modes.' },
                      ]}
                    />
                  </CardContent>
                </Card>

                {/* Breadcrumb */}
                <Card>
                  <CardHeader><CardTitle>Breadcrumb</CardTitle></CardHeader>
                  <CardContent>
                    <Breadcrumb
                      items={[
                        { label: 'Home', href: '#', icon: <Home className="size-4" /> },
                        { label: 'Components', href: '#' },
                        { label: 'Breadcrumb' },
                      ]}
                    />
                  </CardContent>
                </Card>

                {/* Pagination */}
                <Card>
                  <CardHeader><CardTitle>Pagination</CardTitle></CardHeader>
                  <CardContent className="space-y-6">
                    <Pagination currentPage={currentPage} totalPages={10} onPageChange={setCurrentPage} />
                    <SimplePagination currentPage={currentPage} totalPages={10} onPageChange={setCurrentPage} />
                    <CompactPagination currentPage={currentPage} totalPages={10} onPageChange={setCurrentPage} />
                  </CardContent>
                </Card>

                {/* Modal & Drawer */}
                <Card>
                  <CardHeader><CardTitle>Modal & Side Panel</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex gap-4">
                      <Button onClick={() => setModalOpen(true)}>Open Modal</Button>
                      <Button variant="outline" onClick={() => setDrawerOpen(true)}>Open Side Panel</Button>
                      <Button variant="secondary" onClick={() => setShowToast(true)}>Show Toast</Button>
                    </div>
                    <Modal 
                      open={modalOpen} 
                      onOpenChange={setModalOpen}
                      title="Modal Title"
                      description="This is a modal dialog with header and footer."
                      footer={<><Button variant="outline" onClick={() => setModalOpen(false)}>Cancel</Button><Button onClick={() => setModalOpen(false)}>Confirm</Button></>}
                    >
                      <p className="text-neutral-600 dark:text-neutral-400">Modal content goes here. You can put any content inside.</p>
                    </Modal>
                    <SidePanel
                      open={drawerOpen}
                      onOpenChange={setDrawerOpen}
                      title="Side Panel"
                      description="A sliding panel for detailed views."
                      footer={<Button onClick={() => setDrawerOpen(false)}>Close</Button>}
                    >
                      <p className="text-neutral-600 dark:text-neutral-400">Side panel content with scrollable area.</p>
                    </SidePanel>
                  </CardContent>
                </Card>

                {/* Toast Preview */}
                <Card>
                  <CardHeader><CardTitle>Toast / Notifications</CardTitle></CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Toast variant="success" title="Success" description="Operation completed successfully." showCloseButton={false} />
                      <Toast variant="error" title="Error" description="Something went wrong." showCloseButton={false} />
                      <Toast variant="warning" title="Warning" description="Please review before continuing." showCloseButton={false} />
                      <Toast variant="info" title="Info" description="Here's some helpful information." showCloseButton={false} />
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {activeSection === 'export' && (
              <div className="space-y-8">
                <div>
                  <h1 className="text-2xl font-semibold text-neutral-900 dark:text-neutral-100">Export Tokens</h1>
                  <p className="mt-2 text-neutral-600 dark:text-neutral-400">Export design tokens in multiple formats.</p>
                </div>
                <Card>
                  <CardHeader><CardTitle>Export Format</CardTitle></CardHeader>
                  <CardContent>
                    <div className="flex gap-2">
                      {(['css', 'tailwind', 'figma', 'typescript'] as const).map((fmt) => (
                        <Button key={fmt} variant={exportFormat === fmt ? 'primary' : 'outline'} size="sm" onClick={() => setExportFormat(fmt)}>
                          {fmt === 'css' ? 'CSS' : fmt === 'tailwind' ? 'Tailwind' : fmt === 'figma' ? 'Figma JSON' : 'TypeScript'}
                        </Button>
                      ))}
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button onClick={downloadCurrent} leftIcon={<Download className="size-4" />}>Download</Button>
                  </CardFooter>
                </Card>
                <CodePreview code={getExportCode()} filename={
                  exportFormat === 'css' ? 'design-tokens.css' : exportFormat === 'tailwind' ? 'tailwind.config.ts' : exportFormat === 'figma' ? 'figma-variables.json' : 'theme.ts'
                } />
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
