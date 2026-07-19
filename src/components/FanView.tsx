/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Smartphone, Ticket, MapPin, Coffee, AlertTriangle, Send, 
  Sparkles, CheckCircle, Navigation, Loader2, RefreshCw,
  Brain, Mic, Volume2, Search, Car, Info, XCircle
} from 'lucide-react';
import { StadiumState, Incident, ChatMessage } from '../types';
import { translations, LanguageCode } from '../lib/translations';
import { parkingTranslations } from '../lib/parkingTranslations';

const copilotPrompts: Record<LanguageCode, { food: string; parking: string; seat: string; facility: string }> = {
  en: {
    food: "What is the best food recommendation with a short queue?",
    parking: "How do I find the best parking lot near my gate?",
    seat: "Where is Section 103, Row G, Seat 14 and how do I navigate to it?",
    facility: "Where is the nearest restroom or water refill station?"
  },
  es: {
    food: "¿Cuál es la mejor recomendación de comida con fila corta?",
    parking: "¿Cómo encuentro el mejor estacionamiento cerca de mi puerta?",
    seat: "¿Dónde está la Sección 103, Fila G, Asiento 14 y cómo llego?",
    facility: "¿Dónde está el baño o la estación de recarga de agua más cercana?"
  },
  fr: {
    food: "Quelle est la meilleure recommandation de nourriture avec une file d'attente courte?",
    parking: "Comment trouver le meilleur parking près de ma porte?",
    seat: "Où se trouve la Section 103, Rangée G, Siège 14 et comment s'y rendre?",
    facility: "Où se trouvent les toilettes ou la station de recharge d'eau la plus proche?"
  },
  de: {
    food: "Was ist die beste Essensempfehlung mit einer kurzen Schlange?",
    parking: "Wie finde ich den besten Parkplatz in der Nähe meines Gates?",
    seat: "Wo ist Sektor 103, Reihe G, Platz 14 und wie komme ich dorthin?",
    facility: "Wo ist die nächste Toilette oder Wasserstation?"
  },
  nl: {
    food: "Wat is de beste voedselaanbeveling met een korte wachtrij?",
    parking: "Hoe vind ik de beste parkeerplaats bij mijn poort?",
    seat: "Waar is Sectie 103, Rij G, Stoel 14 en hoe navigeer ik daarheen?",
    facility: "Waar is het dichtstbijzijnde toilet of waterpunt?"
  },
  ar: {
    food: "ما هي أفضل توصية طعام مع طابور قصير؟",
    parking: "كيف أجد أفضل موقف سيارات بالقرب من بوابتي؟",
    seat: "أين يقع القسم 103، الصف G، المقعد 14 وكيف أصل إليه؟",
    facility: "أين يوجد أقرب مرحاض أو محطة إعادة تعبئة المياه؟"
  },
  ja: {
    food: "行列の短いおすすめのグルメはどれですか？",
    parking: "ゲートの近くで最適な駐車場を見つけるにはどうすればよいですか？",
    seat: "セクション103、G列、14番席はどこにありますか？行き方を教えてください。",
    facility: "一番近いトイレや給水所はどこですか？"
  },
  hi: {
    food: "कम कतार वाला सबसे अच्छा भोजन कौन सा है?",
    parking: "मुझे अपने गेट के पास सबसे अच्छा पार्किंग स्थल कैसे मिल सकता है?",
    seat: "सेक्शन 103, पंक्ति G, सीट 14 कहाँ है और मैं वहाँ कैसे जाऊँ?",
    facility: "निकटतम शौचालय या पानी भरने का स्थान कहाँ है?"
  },
  te: {
    food: "చిన్న క్యూ ఉన్న ఉత్తమ ఆహార సిఫార్సు ఏమిటి?",
    parking: "నా గేట్ సమీపంలో ఉత్తమ పార్कीంగ్ స్థలాన్ని ఎలా కనుగొనగలను?",
    seat: "సెక్షన్ 103, రో G, సీట్ 14 ఎక్కడ ఉంది మరియు నేను అక్కడికి ఎలా వెళ్ళాలి?",
    facility: "సమీపంలోని టాయిలెట్ లేదా నీటి సదుపాయం ఎక్కడ ఉంది?"
  },
  ta: {
    food: "குறுகிய வரிசை கொண்ட சிறந்த உணவு பரிந்துரை எது?",
    parking: "எனது கேட் அருகில் சிறந்த பார்க்கிங் இடத்தை எவ்வாறு கண்டுபிடிப்பது?",
    seat: "பிரிவு 103, வரிசை G, இருக்கை 14 எங்கே உள்ளது மற்றும் நான் அங்கெ எங்ஙனம் செல்வது?",
    facility: "அருகிலுள்ள கழிப்பறை அல்லது குடிநீர் வசதி எங்கு உள்ளது?"
  }
};

interface FanViewProps {
  state: StadiumState;
  onUpdateState: (newState: StadiumState) => void;
  onShowToast?: (message: string, type?: 'info' | 'success' | 'warning' | 'error') => void;
  language?: LanguageCode;
  onChangeLanguage?: (lang: LanguageCode) => void;
}

export default function FanView({ state, onUpdateState, onShowToast, language = 'en', onChangeLanguage }: FanViewProps) {
  const t = translations[language];
  const pt = parkingTranslations[language] || parkingTranslations['en'];

  const dictationRecRef = React.useRef<any>(null);
  const dictationStartingRef = React.useRef<boolean>(false);

  // Mobile UI Tabs
  const [activeTab, setActiveTab] = useState<'ticket' | 'food' | 'report' | 'chat' | 'parking'>('ticket');

  // Parking state
  const [selectedGate, setSelectedGate] = useState<'Gate A' | 'Gate B' | 'Gate C' | 'Gate D'>('Gate B');
  const [selectedLotId, setSelectedLotId] = useState<'Lot A' | 'Lot B' | 'Lot C' | 'Lot D'>('Lot B');
  const [reservedSpot, setReservedSpot] = useState<string | null>(null);
  const [reserving, setReserving] = useState<boolean>(false);

  // Quick report state
  const [reportType, setReportType] = useState('Maintenance');
  const [reportLocation, setReportLocation] = useState('Section 103');
  const [reportDescription, setReportDescription] = useState('');
  const [reportSeverity, setReportSeverity] = useState<'Low' | 'Medium' | 'High' | 'Critical'>('Medium');
  const [reportSuccess, setReportSuccess] = useState(false);

  // Concession checkout state
  const [orderingFood, setOrderingFood] = useState<string | null>(null);
  const [orderedItem, setOrderedItem] = useState<string | null>(null);
  const [selectedCuisine, setSelectedCuisine] = useState<string>('All');

  // Fan Agent chat state
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'fan-1',
      sender: 'agent',
      agentName: 'Fan Agent',
      text: translations[language]?.welcomeMessage || translations['en'].welcomeMessage,
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);

  // Dynamically synchronize welcome message on language change
  React.useEffect(() => {
    setMessages((prev) =>
      prev.map((m) =>
        m.id === 'fan-1'
          ? { ...m, text: translations[language]?.welcomeMessage || translations['en'].welcomeMessage }
          : m
      )
    );
  }, [language]);

  // Automatically update recommended parking lot on gate change
  React.useEffect(() => {
    if (selectedGate === 'Gate A') {
      setSelectedLotId('Lot A');
    } else if (selectedGate === 'Gate B') {
      setSelectedLotId('Lot A'); // Lot B is full, suggest Lot A
    } else if (selectedGate === 'Gate C') {
      setSelectedLotId('Lot C');
    } else if (selectedGate === 'Gate D') {
      setSelectedLotId('Lot C'); // Lot D is full, suggest Lot C
    }
  }, [selectedGate]);
  const [inputText, setInputText] = useState('');
  const [loadingChat, setLoadingChat] = useState(false);

  // Dynamic Gemini Intelligence options for Fans
  const [selectedModel, setSelectedModel] = useState<'gemini-3.1-flash-lite' | 'gemini-3.1-pro-preview' | 'gemini-3.1-flash-lite'>('gemini-3.1-flash-lite');
  const [useSearchGrounding, setUseSearchGrounding] = useState(false);
  const [useMapsGrounding, setUseMapsGrounding] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [isDictating, setIsDictating] = useState(false);

  // Seat finder toggle
  const [showSeatRoute, setShowSeatRoute] = useState(false);
  const [seatFinderFlowState, setSeatFinderFlowState] = useState<'idle' | 'awaiting_seat_info' | 'processing'>('idle');

  const seatFinderGreetings: Record<string, string> = {
    en: "Hello! 🎫 I am your virtual Seat Finder Assistant. To help you navigate perfectly, could you please tell me your seat and row number?",
    es: "¡Hola! 🎫 Soy tu Asistente Virtual para encontrar tu asiento. Para ayudarte a navegar perfectamente, ¿podrías decirme tu número de asiento y fila?",
    fr: "Bonjour! 🎫 Je suis votre assistant virtuel pour trouver votre siège. Pour vous aider à naviguer au mieux, pourriez-vous m'indiquer votre numéro de siège et de rangée?",
    de: "Hallo! 🎫 Ich bin Ihr virtueller Sitzplatz-Finder-Assistent. Um Ihnen perfekt den Weg zu weisen, nennen Sie mir bitte Ihre Sitz- und Reihennummer?",
    nl: "Hallo! 🎫 Ik ben je virtuele stoelzoeker-assistent. Om je perfect de weg te wijzen, kun je mij je stoel- en rijnummer doorgeven?",
    ar: "مرحباً! 🎫 أنا مساعد العثور على المقاعد الافتراضي. لمساعدتك في التنقل بشكل مثالي، هل يمكنك إخباري برقم مقعدك وصفّك؟",
    ja: "こんにちは！🎫 仮想シートファインダーアシスタントです。目的地までスムーズにご案内するため、座席番号と列番号を教えていただけますか？",
    hi: "नमस्ते! 🎫 मैं आपका वर्चुअल सीट फाइंडर असिस्टेंट हूँ। आपको सही तरीके से नेविगेट करने में मदद करने के लिए, क्या आप मुझे अपना सीट और पंक्ति नंबर बता सकते हैं?",
    te: "నమస్తే! 🎫 నేను మీ వర్చువల్ సీట్ ఫైండర్ అసిస్టెంట్‌ని. మీకు ఖచ్చితంగా మార్గం చూపించడానికి, దయచేసి మీ సీట్ మరియు రో నంబర్‌ను చెప్పగలరా?",
    ta: "வணக்கம்! 🎫 நான் உங்கள் மெய்நிகர் இருக்கை கண்டறிதல் உதவியாளர். உங்களுக்குச் சரியாக வழிகாட்ட, தயவுசெயดยு இருக்கை மற்றும் வரிசை எண்ணைக் கூற முடியுமா?"
  };

  const handleStartSeatFinderFlow = () => {
    setActiveTab('chat');
    setSeatFinderFlowState('awaiting_seat_info');
    
    // Append a custom greeting message from the agent asking for details
    const agentMsg: ChatMessage = {
      id: `agent-seatfinder-${Date.now()}`,
      sender: 'agent',
      agentName: 'Fan Agent',
      text: seatFinderGreetings[language] || seatFinderGreetings['en'],
      timestamp: new Date().toLocaleTimeString(),
    };
    
    setMessages((prev) => [...prev, agentMsg]);

    // Optional speech synthesis if voice is enabled
    if (voiceEnabled) {
      fetch('/api/gemini/voice-assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: seatFinderGreetings[language] || seatFinderGreetings['en'],
          voiceName: 'Puck',
        }),
      })
      .then(r => r.json())
      .then(d => {
        if (d.audioBase64) playPcmAudio(d.audioBase64);
      })
      .catch(e => console.error(e));
    }
  };

  // Play PCM Audio helper
  const playPcmAudio = (base64Data: string) => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return;
      const audioCtx = new AudioContextClass({ sampleRate: 24000 });
      const binaryString = window.atob(base64Data);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const arrayBuffer = bytes.buffer;
      const int16Array = new Int16Array(arrayBuffer);
      const float32Array = new Float32Array(int16Array.length);
      for (let i = 0; i < int16Array.length; i++) {
        float32Array[i] = int16Array[i] / 32768;
      }
      const audioBuffer = audioCtx.createBuffer(1, float32Array.length, 24000);
      audioBuffer.getChannelData(0).set(float32Array);
      const source = audioCtx.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioCtx.destination);
      source.start();
    } catch (err) {
      console.error('Audio playback failed', err);
    }
  };

  // Browser-native speech-to-text dictation
  const startDictation = () => {
    if (dictationStartingRef.current) return;

    if (isDictating && dictationRecRef.current) {
      try {
        dictationRecRef.current.abort();
      } catch (err) {
        console.error('Error aborting dictation:', err);
      }
      setIsDictating(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        dictationStartingRef.current = true;
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = 'en-US';
        
        recognition.onstart = () => {
          setIsDictating(true);
          dictationStartingRef.current = false;
        };
        
        recognition.onend = () => {
          setIsDictating(false);
          dictationStartingRef.current = false;
          dictationRecRef.current = null;
        };
        
        recognition.onresult = (event: any) => {
          const transcript = event.results[0][0].transcript;
          setInputText(transcript);
        };
        
        recognition.onerror = (err: any) => {
          console.error('Speech recognition error:', err);
          setIsDictating(false);
          dictationStartingRef.current = false;
        };

        dictationRecRef.current = recognition;
        recognition.start();
      } catch (err: any) {
        console.error('Failed to start dictation:', err);
        setIsDictating(false);
        dictationStartingRef.current = false;
      }
    } else {
      if (onShowToast) {
        onShowToast("Microphone dictation is not supported or accessible in this browser view.", 'warning');
      } else {
        try { alert("Microphone dictation is not supported or accessible in this browser view."); } catch (_) {}
      }
    }
  };

  // Fan Copilot Action
  const handleCopilotAction = async (promptText: string) => {
    if (loadingChat) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: promptText,
      timestamp: new Date().toLocaleTimeString(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setLoadingChat(true);

    try {
      const response = await fetch('/api/gemini/fan-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          stadiumState: state,
          model: selectedModel,
          useSearch: useSearchGrounding,
          useMaps: useMapsGrounding,
          language: language,
        }),
      });

      if (!response.ok) throw new Error('Failed to fetch Fan Agent reply');
      const data = await response.json();

      const responseText = data.text || "I'm looking into this for you. Let me coordinate with our support teams!";

      setMessages((prev) => [
        ...prev,
        {
          id: `agent-${Date.now()}`,
          sender: 'agent',
          agentName: 'Fan Agent',
          text: responseText,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);

      if (data.raiseIncident) {
        const inc = data.raiseIncident;
        const autoIncident: Incident = {
          id: `inc-fanchat-${Date.now()}`,
          title: inc.title || `AI Auto-Report: ${inc.category} at ${inc.location}`,
          category: (inc.category as any) || 'Maintenance',
          severity: (inc.severity as any) || 'Medium',
          location: inc.location || 'Section 103',
          description: inc.description || 'Reported via Fan Assistant Smart Chat',
          status: 'Reported',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
          reportedBy: 'Fan',
          aiSuggestedFix: `Smart Chat Assistant Advice: Proceed to ${inc.location} immediately. Assisting: ${inc.category === 'Security' ? 'Security' : inc.category === 'Medical' ? 'Medical' : 'Janitorial'} staff.`,
        };

        // Inject incident to central state
        onUpdateState({
          ...state,
          incidents: [autoIncident, ...state.incidents],
        });

        // Add visual confirmation in the mobile chat
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: `sys-${Date.now()}`,
              sender: 'agent',
              agentName: 'Dispatch Center',
              text: `🚨 [Command Dispatch Connected] Your chat report regarding "${autoIncident.title}" has been registered in the Ops Dashboard! Standard response protocols triggered.`,
              timestamp: new Date().toLocaleTimeString(),
            },
          ]);
        }, 800);
      }

      // If voice output is enabled, synthesize and speak the reply
      if (voiceEnabled) {
        try {
          const voiceRes = await fetch('/api/gemini/voice-assistant', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              prompt: `Speak this fan advice in a friendly stadium voice: "${data.text}"`,
              voiceName: 'Puck',
            }),
          });
          if (voiceRes.ok) {
            const voiceData = await voiceRes.json();
            if (voiceData.audioBase64) {
              playPcmAudio(voiceData.audioBase64);
            }
          }
        } catch (vErr) {
          console.error('Failed to voice response:', vErr);
        }
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          id: `agent-err-${Date.now()}`,
          sender: 'agent',
          agentName: 'Fan Agent',
          text: '💡 Communication line busy, but rest assured our venue staff is actively monitoring all sectors!',
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setLoadingChat(false);
    }
  };

  // Chat request to Fan Agent
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: inputText,
      timestamp: new Date().toLocaleTimeString(),
    };

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputText('');
    setLoadingChat(true);

    const isSeatFinderActive = seatFinderFlowState === 'awaiting_seat_info';

    try {
      const response = await fetch('/api/gemini/fan-chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          stadiumState: state,
          model: selectedModel,
          useSearch: useSearchGrounding,
          useMaps: useMapsGrounding,
          language: language,
          seatFinderContext: isSeatFinderActive ? userMsg.text : undefined,
        }),
      });

      if (isSeatFinderActive) {
        setSeatFinderFlowState('idle');
      }

      if (!response.ok) throw new Error('Failed to fetch Fan Agent reply');
      const data = await response.json();

      const responseText = data.text || "I'm looking into this for you. Let me coordinate with our support teams!";

      setMessages((prev) => [
        ...prev,
        {
          id: `agent-${Date.now()}`,
          sender: 'agent',
          agentName: 'Fan Agent',
          text: responseText,
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);

      if (data.raiseIncident) {
        const inc = data.raiseIncident;
        const autoIncident: Incident = {
          id: `inc-fanchat-${Date.now()}`,
          title: inc.title || `AI Auto-Report: ${inc.category} at ${inc.location}`,
          category: (inc.category as any) || 'Maintenance',
          severity: (inc.severity as any) || 'Medium',
          location: inc.location || 'Section 103',
          description: inc.description || 'Reported via Fan Assistant Smart Chat',
          status: 'Reported',
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
          reportedBy: 'Fan',
          aiSuggestedFix: `Smart Chat Assistant Advice: Proceed to ${inc.location} immediately. Assisting: ${inc.category === 'Security' ? 'Security' : inc.category === 'Medical' ? 'Medical' : 'Janitorial'} staff.`,
        };

        // Inject incident to central state
        onUpdateState({
          ...state,
          incidents: [autoIncident, ...state.incidents],
        });

        // Add visual confirmation in the mobile chat
        setTimeout(() => {
          setMessages((prev) => [
            ...prev,
            {
              id: `sys-${Date.now()}`,
              sender: 'agent',
              agentName: 'Dispatch Center',
              text: `🚨 [Command Dispatch Connected] Your chat report regarding "${autoIncident.title}" has been registered in the Ops Dashboard! Standard response protocols triggered.`,
              timestamp: new Date().toLocaleTimeString(),
            },
          ]);
        }, 800);
      }

      // If voice output is enabled, synthesize and speak the reply
      if (voiceEnabled) {
        try {
          const voiceRes = await fetch('/api/gemini/voice-assistant', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              prompt: `Speak this fan advice in a friendly stadium voice: "${data.text}"`,
              voiceName: 'Puck',
            }),
          });
          if (voiceRes.ok) {
            const voiceData = await voiceRes.json();
            if (voiceData.audioBase64) {
              playPcmAudio(voiceData.audioBase64);
            }
          }
        } catch (vErr) {
          console.error('Failed to voice response:', vErr);
        }
      }
    } catch (error) {
      console.error(error);
      setMessages((prev) => [
        ...prev,
        {
          id: `agent-err-${Date.now()}`,
          sender: 'agent',
          agentName: 'Fan Agent',
          text: "🍔 I'm currently fetching wait times. Let me know if you need help finding your ticket or seat section!",
          timestamp: new Date().toLocaleTimeString(),
        },
      ]);
    } finally {
      setLoadingChat(false);
    }
  };

  // Log new Incident reported by Fan
  const handleReportIncident = (e: React.FormEvent) => {
    e.preventDefault();
    if (!reportDescription.trim()) return;

    const categoryMapping: { [key: string]: 'Security' | 'Medical' | 'CrowdControl' | 'Maintenance' | 'Weather' } = {
      'Security': 'Security',
      'Medical': 'Medical',
      'Janitorial': 'Maintenance',
      'Maintenance': 'Maintenance',
    };

    const newIncident: Incident = {
      id: `inc-fan-${Date.now()}`,
      title: `Fan Report: ${reportType} at ${reportLocation}`,
      category: categoryMapping[reportType] || 'Maintenance',
      severity: reportSeverity,
      location: reportLocation,
      description: reportDescription,
      status: 'Reported',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false }),
      reportedBy: 'Fan',
      aiSuggestedFix: `Fan reported ${reportType}. Recommendation: Dispatch ${reportType === 'Security' ? 'Security' : reportType === 'Medical' ? 'Medical' : 'Janitorial'} team nearest to ${reportLocation} immediately.`,
    };

    // Update StadiumState with new incident
    onUpdateState({
      ...state,
      incidents: [newIncident, ...state.incidents],
    });

    setReportSuccess(true);
    setReportDescription('');
    setTimeout(() => {
      setReportSuccess(false);
      setActiveTab('ticket');
    }, 3000);
  };

  // Simulated Order Concession
  const handleOrderFood = (item: string) => {
    setOrderingFood(item);
    setTimeout(() => {
      setOrderingFood(null);
      setOrderedItem(item);
      setTimeout(() => setOrderedItem(null), 4000);
    }, 2000);
  };

  return (
    <div id="fan-phone-simulator" className="flex justify-center items-center h-full p-2">
      
      {/* Smartphone Outer Container */}
      <div className="w-[340px] h-[610px] bg-slate-950 border-[8px] border-slate-800 rounded-[36px] flex flex-col shadow-2xl relative overflow-hidden ring-4 ring-slate-900/40">
        
        {/* Smartphone Camera Notch / Speaker */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-32 h-5 bg-slate-800 rounded-full z-30 flex items-center justify-center gap-1.5 px-3">
          <div className="w-1.5 h-1.5 rounded-full bg-slate-900" /> {/* Lens */}
          <div className="w-10 h-1 bg-slate-900 rounded-full" /> {/* Speaker */}
        </div>

        {/* Smartphone Signal / Battery Header bar */}
        <div className="bg-slate-900 h-9 pt-5 px-6 flex justify-between items-center text-[10px] font-semibold text-slate-400 select-none z-20">
          <span>Stadium Pulse Mobile</span>
          <div className="flex items-center gap-1">
            <span>5G</span>
            <div className="w-5 h-2.5 border border-slate-500 rounded-xs p-0.5 flex">
              <div className="bg-emerald-500 h-full w-4/5 rounded-2xs" />
            </div>
          </div>
        </div>

        {/* Mobile App Screen Shell */}
        <div className="flex-1 flex flex-col bg-slate-900 overflow-hidden relative">
          
          {/* Emergency Push Notification Overlay */}
          {state.emergencyBroadcast && (
            <div className="absolute top-12 left-2 right-2 bg-red-600 rounded-2xl p-3 shadow-2xl z-50 animate-in slide-in-from-top-4 fade-in duration-300 border border-red-400">
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-1.5 text-white">
                  <AlertTriangle className="h-4 w-4 animate-pulse" />
                  <span className="font-bold text-xs uppercase">{t.alertTitle}</span>
                </div>
                <span className="text-[9px] text-red-200 font-mono">{state.emergencyBroadcast.timestamp}</span>
              </div>
              <p className="text-white text-xs leading-relaxed font-medium mt-1">
                {state.emergencyBroadcast.message}
              </p>
              <button 
                onClick={() => onUpdateState({ ...state, emergencyBroadcast: null })}
                className="mt-2.5 w-full bg-red-800/80 hover:bg-red-800 text-white text-[10px] py-1.5 rounded-lg font-bold transition-colors cursor-pointer"
              >
                {t.dismissAlert}
              </button>
            </div>
          )}

          {/* Top Branding Nav bar */}
          <div className="bg-slate-900/95 border-b border-slate-800/80 px-4 py-2.5 flex items-center justify-between z-10 shadow-sm">
            <span className="text-xs font-bold tracking-tight text-white flex items-center gap-1">
              <Sparkles className="h-3.5 w-3.5 text-emerald-400" />
              {t.fanCompanion}
            </span>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] bg-slate-800 px-2 py-0.5 rounded-full text-slate-300 font-mono">
                {t.secRowSeat}
              </span>
              {/* Language Switcher Synced in Phone view */}
              <select
                value={language}
                onChange={(e) => onChangeLanguage?.(e.target.value as LanguageCode)}
                className="bg-slate-800 border-none rounded px-1.5 py-0.5 text-[9px] text-slate-300 font-mono cursor-pointer focus:outline-none focus:ring-0"
              >
                <option value="en">EN</option>
                <option value="es">ES</option>
                <option value="fr">FR</option>
                <option value="de">DE</option>
                <option value="ar">AR</option>
                <option value="ja">JA</option>
                <option value="nl">NL</option>
                <option value="hi">HI</option>
                <option value="te">TE</option>
                <option value="ta">TA</option>
              </select>
            </div>
          </div>

          {/* Tab Views content area */}
          <div className="flex-1 overflow-y-auto p-4 text-left">
            
            {/* TAB 1: Ticket Wallet & seat finder */}
            {activeTab === 'ticket' && (
              <div className="space-y-4">
                <div className="bg-gradient-to-br from-indigo-900/80 to-slate-900 border border-indigo-500/30 rounded-2xl p-4 shadow-xl relative overflow-hidden">
                  <div className="absolute -right-6 -bottom-6 w-24 h-24 bg-indigo-500/10 rounded-full blur-xl" />
                  
                  <div className="flex justify-between items-start border-b border-indigo-500/20 pb-2">
                    <div>
                      <span className="text-[9px] uppercase font-bold tracking-wider text-indigo-400">{t.stadiumPulseVIP}</span>
                      <h4 className="font-extrabold text-sm text-white mt-0.5">{t.championsLeagueFinal}</h4>
                    </div>
                    <Ticket className="h-6 w-6 text-indigo-400" />
                  </div>

                  <div className="grid grid-cols-3 gap-2 my-3 text-center">
                    <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                      <span className="text-[8px] text-slate-500 block uppercase font-mono">{t.section}</span>
                      <span className="text-sm font-bold text-white">103</span>
                    </div>
                    <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                      <span className="text-[8px] text-slate-500 block uppercase font-mono">{t.row}</span>
                      <span className="text-sm font-bold text-white">G</span>
                    </div>
                    <div className="bg-slate-950/60 p-2 rounded-lg border border-slate-800">
                      <span className="text-[8px] text-slate-500 block uppercase font-mono">{t.seat}</span>
                      <span className="text-sm font-bold text-white">12</span>
                    </div>
                  </div>

                  {/* QR barcode mock representation */}
                  <div className="bg-white p-2.5 rounded-lg flex flex-col items-center justify-center border border-slate-800 my-4">
                    <div className="h-8 w-full bg-repeating-barcode" />
                    <span className="text-[8px] text-slate-900 font-mono font-bold mt-1.5">★ SV-9382-VIP-12 ★</span>
                  </div>

                  <div className="flex flex-col gap-2">
                    <button 
                      onClick={() => setShowSeatRoute(!showSeatRoute)}
                      className="w-full bg-slate-800 hover:bg-slate-750 text-slate-200 font-semibold text-xs py-2 rounded-lg transition-colors flex items-center justify-center gap-1.5 border border-slate-700"
                    >
                      <Navigation className="h-3.5 w-3.5" />
                      {showSeatRoute ? t.hideGuide : t.showGuide}
                    </button>

                    <button 
                      onClick={handleStartSeatFinderFlow}
                      className="w-full bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white font-extrabold text-xs py-2 rounded-lg transition-all flex items-center justify-center gap-1.5 shadow-lg active:scale-[0.98]"
                    >
                      <Sparkles className="h-3.5 w-3.5 text-yellow-300 animate-pulse" />
                      💬 Start Interactive Seat-Finder Chatbot
                    </button>
                  </div>

                  {showSeatRoute && (
                    <div className="mt-3 bg-slate-950/80 p-2.5 rounded-lg border border-indigo-500/20 text-[10px] text-slate-300 leading-relaxed space-y-1">
                      <p className="font-semibold text-indigo-400">{t.routeInstructions}</p>
                      <p>{t.routeStep1}</p>
                      <p>{t.routeStep2}</p>
                      <p>{t.routeStep3}</p>
                    </div>
                  )}
                </div>

                {/* Event Schedule Alert card */}
                <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 text-xs flex gap-2.5">
                  <span className="text-xl">⚽</span>
                  <div>
                    <span className="font-bold text-slate-200 block">{t.activeEvent}</span>
                    <span className="text-[10px] text-emerald-400 mt-0.5 inline-block">{t.eventStatus}</span>
                  </div>
                </div>
              </div>
            )}

            {/* TAB 2: Concessions & mobile ordering */}
            {activeTab === 'food' && (
              <div className="space-y-3">
                <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider mb-1">{t.queueSpeeds}</h4>
                
                {/* Cuisine Filter Pills */}
                <div className="flex gap-1 overflow-x-auto pb-1.5 scrollbar-none select-none">
                  {[
                    { key: 'All', label: 'All 🍽️' },
                    { key: 'Indian', label: 'Indian 🇮🇳' },
                    { key: 'Dutch', label: 'Dutch 🇳🇱' },
                    { key: 'Mexican', label: 'Mexican 🇲🇽' },
                    { key: 'Italian', label: 'Italian 🇮🇹' },
                    { key: 'Japanese', label: 'Japanese 🇯🇵' },
                    { key: 'Drinks', label: 'Drinks 🍻' },
                    { key: 'Merch', label: 'Merch 👕' }
                  ].map((c) => (
                    <button
                      key={c.key}
                      onClick={() => setSelectedCuisine(c.key)}
                      className={`px-2 py-0.5 rounded-full text-[9px] font-bold whitespace-nowrap transition-all cursor-pointer ${
                        selectedCuisine === c.key
                          ? 'bg-emerald-500 text-slate-950 font-extrabold shadow-sm'
                          : 'bg-slate-900 text-slate-400 hover:bg-slate-850 hover:text-slate-200 border border-slate-800'
                      }`}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>

                {state.concessions
                  .filter((item) => selectedCuisine === 'All' || item.cuisine === selectedCuisine)
                  .map((item) => {
                    const isQueued = item.queueLength > 10;
                    const queueColor = isQueued ? 'text-red-400' : 'text-emerald-400';
                    
                    // Custom menu items per cuisine type
                    let button1Text = t.comboLabel;
                    let button2Text = t.sodaLabel;
                    let item1Name = `${item.name} Combo`;
                    let item2Name = `${item.name} Beverage`;

                    const itemCuisine = item.cuisine || 'Mexican';

                    if (itemCuisine === 'Indian') {
                      button1Text = "Samosa Combo ($8)";
                      button2Text = "Biryani ($15)";
                      item1Name = "Samosa & Masala Chai Combo";
                      item2Name = "Butter Chicken Biryani";
                    } else if (itemCuisine === 'Dutch') {
                      button1Text = "Frites Mayo ($7)";
                      button2Text = "Stroopwafel ($12)";
                      item1Name = "Dutch Frites with Mayo";
                      item2Name = "Stroopwafel & Craft Lager";
                    } else if (itemCuisine === 'Italian') {
                      button1Text = "Margherita ($6)";
                      button2Text = "Pizza Combo ($12)";
                      item1Name = "Margherita Pizza Slice";
                      item2Name = "Classic Pizza & Soda Combo";
                    } else if (itemCuisine === 'Japanese') {
                      button1Text = "Gyoza Plate ($8)";
                      button2Text = "Sushi Roll ($14)";
                      item1Name = "Crispy Pork Gyoza Plate";
                      item2Name = "Salmon Sushi Roll Combo";
                    } else if (itemCuisine === 'Mexican') {
                      button1Text = "Tacos Combo ($12)";
                      button2Text = "Loaded Nachos ($10)";
                      item1Name = "Three-Taco Combo Plate";
                      item2Name = "Loaded Nachos with Queso";
                    } else if (itemCuisine === 'Drinks') {
                      button1Text = "Draft Beer ($9)";
                      button2Text = "Large Soda ($5)";
                      item1Name = "Premium Ice Cold Draft Beer";
                      item2Name = "Large Fountain Soda";
                    } else if (itemCuisine === 'Merch') {
                      button1Text = "Team Scarf ($15)";
                      button2Text = "Official Jersey ($85)";
                      item1Name = "World Cup Commemorative Scarf";
                      item2Name = "Official USA Match Jersey";
                    }

                    return (
                      <div key={item.id} className="bg-slate-950/80 border border-slate-800 rounded-xl p-3 flex flex-col gap-2">
                        <div className="flex justify-between items-start">
                          <div>
                            <span className="font-bold text-xs text-white block">{item.name}</span>
                            <span className="text-[9px] text-slate-500 font-mono uppercase">{item.category} • {item.location}</span>
                          </div>
                          <div className="text-right">
                            <span className={`text-xs font-bold block ${queueColor}`}>
                              {item.avgWaitMinutes} {t.mins}
                            </span>
                            <span className="text-[9px] text-slate-500 block font-mono">{t.queueFans.replace('{n}', item.queueLength.toString())}</span>
                          </div>
                        </div>

                        {/* Dynamic Quick-Order Cuisine Options */}
                        <div className="flex gap-1.5 mt-1">
                          <button
                            onClick={() => handleOrderFood(item1Name)}
                            disabled={orderingFood !== null}
                            className="flex-1 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded px-2 py-1 text-[9px] font-semibold text-slate-300 flex items-center justify-center gap-1 cursor-pointer transition-colors"
                          >
                            <Coffee className="h-2.5 w-2.5 text-emerald-400" />
                            {button1Text}
                          </button>
                          <button
                            onClick={() => handleOrderFood(item2Name)}
                            disabled={orderingFood !== null}
                            className="flex-1 bg-slate-900 hover:bg-slate-850 border border-slate-800 rounded px-2 py-1 text-[9px] font-semibold text-slate-300 flex items-center justify-center gap-1 cursor-pointer transition-colors"
                          >
                            {button2Text}
                          </button>
                        </div>
                      </div>
                    );
                  })}

                {state.concessions.filter((item) => selectedCuisine === 'All' || item.cuisine === selectedCuisine).length === 0 && (
                  <div className="text-center py-6 text-slate-500 text-[10px] bg-slate-950/40 rounded-xl border border-dashed border-slate-800">
                    No concessions found in this section for "{selectedCuisine}".
                  </div>
                )}

                {/* Simulated Checkout screen overlays */}
                {orderingFood && (
                  <div className="bg-indigo-950/80 border border-indigo-500/30 p-3 rounded-lg flex items-center gap-2.5 text-xs text-slate-200">
                    <Loader2 className="h-4 w-4 animate-spin text-indigo-400" />
                    <span>{t.processingPayment.replace('{item}', orderingFood)}</span>
                  </div>
                )}

                {orderedItem && (
                  <div className="bg-emerald-950/80 border border-emerald-500/30 p-3 rounded-lg flex items-center gap-2.5 text-xs text-slate-200 animate-pulse">
                    <CheckCircle className="h-4 w-4 text-emerald-400" />
                    <div>
                      <span className="font-bold block text-emerald-400">Order Placed! Receipt #4823</span>
                      <span className="text-[10px] text-slate-300">Pick up at Express lane when notified.</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 3: Incident quick-report form */}
            {activeTab === 'report' && (
              <div className="space-y-4">
                <div className="bg-amber-950/10 border border-amber-900/30 p-3 rounded-xl flex gap-2.5 text-xs text-amber-200">
                  <AlertTriangle className="h-5 w-5 text-amber-500 flex-shrink-0" />
                  <p className="leading-relaxed">
                    <strong>{t.reportTitle}</strong> {t.reportDisclaimer}
                  </p>
                </div>

                {reportSuccess ? (
                  <div className="bg-slate-950 p-6 rounded-xl border border-slate-800 text-center space-y-2">
                    <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto" />
                    <h5 className="font-bold text-xs text-white">{t.successTitle}</h5>
                    <p className="text-[10px] text-slate-400 leading-relaxed">
                      {t.successDesc.replace('{loc}', reportLocation)}
                    </p>
                  </div>
                ) : (
                  <form onSubmit={handleReportIncident} className="space-y-3.5">
                    <div>
                      <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">{t.issueCategory}</label>
                      <select
                        value={reportType}
                        onChange={(e) => setReportType(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs px-2.5 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                      >
                        <option value="Janitorial">{t.catJanitorial}</option>
                        <option value="Security">{t.catSecurity}</option>
                        <option value="Medical">{t.catMedical}</option>
                        <option value="Maintenance">{t.catMaintenance}</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">{t.locationSeat}</label>
                      <input
                        type="text"
                        value={reportLocation}
                        onChange={(e) => setReportLocation(e.target.value)}
                        placeholder="e.g. Section 103, Row G, Seat 12"
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs px-2.5 py-2 text-slate-200 focus:outline-none focus:border-indigo-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">{t.severityLabel}</label>
                      <select
                        value={reportSeverity}
                        onChange={(e) => setReportSeverity(e.target.value as any)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs px-2.5 py-2 text-slate-200 focus:outline-none focus:border-indigo-500 font-bold"
                      >
                        <option value="Low">{t.severityLow}</option>
                        <option value="Medium">{t.severityMedium}</option>
                        <option value="High">{t.severityHigh}</option>
                        <option value="Critical">{t.severityCritical}</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono text-slate-500 uppercase block mb-1">{t.detailsLabel}</label>
                      <textarea
                        value={reportDescription}
                        onChange={(e) => setReportDescription(e.target.value)}
                        placeholder="..."
                        rows={3}
                        className="w-full bg-slate-950 border border-slate-800 rounded-lg text-xs p-2.5 text-slate-200 focus:outline-none focus:border-indigo-500"
                        required
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full bg-amber-600 hover:bg-amber-500 text-white font-semibold text-xs py-2 rounded-lg shadow-md transition-colors"
                    >
                      {t.submitReport}
                    </button>
                  </form>
                )}
              </div>
            )}

            {/* TAB 5: Interactive Parking System */}
            {activeTab === 'parking' && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <h4 className="font-bold text-xs text-slate-400 uppercase tracking-wider">{t.parking}</h4>
                  {reservedSpot && (
                    <span className="text-[9px] bg-indigo-500/20 text-indigo-400 font-extrabold px-1.5 py-0.5 rounded-full border border-indigo-500/20 animate-pulse">
                      Permit Active
                    </span>
                  )}
                </div>

                {/* Gate selector */}
                <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 space-y-2">
                  <span className="text-[10px] text-slate-500 font-mono block uppercase">{t.gateSelect}</span>
                  <div className="grid grid-cols-4 gap-1">
                    {(['Gate A', 'Gate B', 'Gate C', 'Gate D'] as const).map((g) => (
                      <button
                        key={g}
                        onClick={() => setSelectedGate(g)}
                        className={`py-1 rounded text-[10px] font-bold border transition-colors cursor-pointer ${
                          selectedGate === g
                            ? 'bg-indigo-600 text-white border-indigo-500 shadow'
                            : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200'
                        }`}
                      >
                        {g}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Suggested Lot recommendation card */}
                {(() => {
                  const closestLot = selectedGate === 'Gate A' ? 'Lot A' : selectedGate === 'Gate B' ? 'Lot B' : selectedGate === 'Gate C' ? 'Lot C' : 'Lot D';
                  const suggestion = selectedGate === 'Gate A' ? 'Lot A' : selectedGate === 'Gate B' ? 'Lot A' : selectedGate === 'Gate C' ? 'Lot C' : 'Lot C';
                  const isClosestFull = closestLot === 'Lot B' || closestLot === 'Lot D';
                  
                  return (
                    <div className={`p-3 rounded-xl border text-[11px] leading-relaxed ${
                      isClosestFull 
                        ? 'bg-amber-950/20 border-amber-900/40 text-amber-200' 
                        : 'bg-emerald-950/20 border-emerald-900/40 text-emerald-200'
                    }`}>
                      <div className="flex items-start gap-2">
                        <div className="mt-0.5">
                          {isClosestFull ? (
                            <AlertTriangle className="h-4 w-4 text-amber-400 flex-shrink-0" />
                          ) : (
                            <CheckCircle className="h-4 w-4 text-emerald-400 flex-shrink-0" />
                          )}
                        </div>
                        <div className="space-y-1">
                          <p className="font-bold text-xs">
                            {t.suggestedLot} <span className="underline decoration-wavy text-indigo-400">{suggestion}</span>
                          </p>
                          <p className="text-[10px] opacity-90 leading-normal">
                            {selectedGate === 'Gate A' && pt.parkingInstructionsA}
                            {selectedGate === 'Gate B' && pt.parkingInstructionsB}
                            {selectedGate === 'Gate C' && pt.parkingInstructionsC}
                            {selectedGate === 'Gate D' && pt.parkingInstructionsD}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Map of Parking Lots */}
                <div className="bg-slate-950/80 p-2.5 rounded-xl border border-slate-800 flex flex-col items-center justify-center">
                  <span className="text-[8px] text-slate-500 font-mono block uppercase mb-1.5">{t.parkingStatus}</span>
                  
                  {/* SVG Map of parking areas */}
                  <svg viewBox="0 0 300 200" className="w-full max-w-[280px] h-auto">
                    {/* Grid background pattern */}
                    <defs>
                      <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                        <path d="M 10 0 L 0 0 0 10" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5"/>
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#grid)" />

                    {/* Outer Ring / Stadium Pathway */}
                    <circle cx="150" cy="100" r="45" fill="none" stroke="#334155" strokeWidth="2" strokeDasharray="4,4" />

                    {/* Central Stadium Oval */}
                    <ellipse cx="150" cy="100" rx="40" ry="32" fill="#1e293b" stroke="#475569" strokeWidth="2" />
                    
                    {/* Inner pitch representing stadium field */}
                    <ellipse cx="150" cy="100" rx="16" ry="10" fill="#15803d" stroke="#22c55e" strokeWidth="1" />
                    <line x1="150" y1="90" x2="150" y2="110" stroke="#ffffff" strokeWidth="0.5" opacity="0.4" />
                    <ellipse cx="150" cy="100" rx="4" ry="2" fill="none" stroke="#ffffff" strokeWidth="0.5" opacity="0.4" />
                    
                    {/* Stadium Core Text label */}
                    <text x="150" y="103" textAnchor="middle" fill="#ffffff" fontSize="6" fontWeight="bold" opacity="0.7" fontFamily="monospace">STADIUM</text>

                    {/* Gate Markers on Stadium */}
                    {/* Gate A (North) */}
                    <circle cx="150" cy="68" r="4" fill="#6366f1" />
                    <text x="150" y="65" textAnchor="middle" fill="#818cf8" fontSize="5" fontWeight="bold">A</text>
                    {/* Gate B (East) */}
                    <circle cx="190" cy="100" r="4" fill="#6366f1" />
                    <text x="195" y="102" textAnchor="start" fill="#818cf8" fontSize="5" fontWeight="bold">B</text>
                    {/* Gate C (South) */}
                    <circle cx="150" cy="132" r="4" fill="#6366f1" />
                    <text x="150" y="139" textAnchor="middle" fill="#818cf8" fontSize="5" fontWeight="bold">C</text>
                    {/* Gate D (West) */}
                    <circle cx="110" cy="100" r="4" fill="#6366f1" />
                    <text x="105" y="102" textAnchor="end" fill="#818cf8" fontSize="5" fontWeight="bold">D</text>

                    {/* Lot A (North Parking Lot) */}
                    <g 
                       onClick={() => setSelectedLotId('Lot A')} 
                      className="cursor-pointer group"
                    >
                      <rect 
                        x="100" y="15" width="100" height="24" rx="3" 
                        fill={selectedLotId === 'Lot A' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(16, 185, 129, 0.05)'} 
                        stroke={selectedLotId === 'Lot A' ? '#818cf8' : '#10b981'} 
                        strokeWidth={selectedLotId === 'Lot A' ? '1.5' : '1'} 
                        className="transition-all hover:fill-indigo-950/40"
                      />
                      <text x="150" y="27" textAnchor="middle" fill="#ffffff" fontSize="6" fontWeight="bold">{pt.lotNameA}</text>
                      <text x="150" y="34" textAnchor="middle" fill="#10b981" fontSize="5" fontWeight="bold">158 {pt.spotsOpen}</text>
                      {selectedLotId === 'Lot A' && (
                        <rect x="98" y="13" width="104" height="28" rx="4" fill="none" stroke="#6366f1" strokeWidth="0.5" strokeDasharray="3,3" className="animate-pulse" />
                      )}
                    </g>

                    {/* Lot B (East Parking Lot - Full) */}
                    <g 
                       onClick={() => setSelectedLotId('Lot B')} 
                      className="cursor-pointer group"
                    >
                      <rect 
                        x="225" y="55" width="60" height="90" rx="3" 
                        fill={selectedLotId === 'Lot B' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(239, 68, 68, 0.05)'} 
                        stroke={selectedLotId === 'Lot B' ? '#818cf8' : '#ef4444'} 
                        strokeWidth={selectedLotId === 'Lot B' ? '1.5' : '1'} 
                        className="transition-all hover:fill-indigo-950/40"
                      />
                      <text x="255" y="96" textAnchor="middle" fill="#ffffff" fontSize="6" fontWeight="bold">{pt.lotNameB}</text>
                      <text x="255" y="104" textAnchor="middle" fill="#ef4444" fontSize="5" fontWeight="bold">{t.lotFull}</text>
                      {selectedLotId === 'Lot B' && (
                        <rect x="223" y="53" width="64" height="94" rx="4" fill="none" stroke="#6366f1" strokeWidth="0.5" strokeDasharray="3,3" className="animate-pulse" />
                      )}
                    </g>

                    {/* Lot C (South Parking Lot) */}
                    <g 
                       onClick={() => setSelectedLotId('Lot C')} 
                      className="cursor-pointer group"
                    >
                      <rect 
                        x="100" y="160" width="100" height="24" rx="3" 
                        fill={selectedLotId === 'Lot C' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(16, 185, 129, 0.05)'} 
                        stroke={selectedLotId === 'Lot C' ? '#818cf8' : '#10b981'} 
                        strokeWidth={selectedLotId === 'Lot C' ? '1.5' : '1'} 
                        className="transition-all hover:fill-indigo-950/40"
                      />
                      <text x="150" y="172" textAnchor="middle" fill="#ffffff" fontSize="6" fontWeight="bold">{pt.lotNameC}</text>
                      <text x="150" y="179" textAnchor="middle" fill="#10b981" fontSize="5" fontWeight="bold">245 {pt.spotsOpen}</text>
                      {selectedLotId === 'Lot C' && (
                        <rect x="98" y="158" width="104" height="28" rx="4" fill="none" stroke="#6366f1" strokeWidth="0.5" strokeDasharray="3,3" className="animate-pulse" />
                      )}
                    </g>

                    {/* Lot D (West Parking Lot - Full) */}
                    <g 
                       onClick={() => setSelectedLotId('Lot D')} 
                      className="cursor-pointer group"
                    >
                      <rect 
                        x="15" y="55" width="60" height="90" rx="3" 
                        fill={selectedLotId === 'Lot D' ? 'rgba(99, 102, 241, 0.15)' : 'rgba(239, 68, 68, 0.05)'} 
                        stroke={selectedLotId === 'Lot D' ? '#818cf8' : '#ef4444'} 
                        strokeWidth={selectedLotId === 'Lot D' ? '1.5' : '1'} 
                        className="transition-all hover:fill-indigo-950/40"
                      />
                      <text x="45" y="96" textAnchor="middle" fill="#ffffff" fontSize="6" fontWeight="bold">{pt.lotNameD}</text>
                      <text x="45" y="104" textAnchor="middle" fill="#ef4444" fontSize="5" fontWeight="bold">{t.lotFull}</text>
                      {selectedLotId === 'Lot D' && (
                        <rect x="13" y="53" width="64" height="94" rx="4" fill="none" stroke="#6366f1" strokeWidth="0.5" strokeDasharray="3,3" className="animate-pulse" />
                      )}
                    </g>
                  </svg>
                  <p className="text-[9px] text-slate-500 mt-1.5 text-center">
                    {pt.parkingTip}
                  </p>
                </div>

                {/* Reservation / Spot Status Grid */}
                {selectedLotId && (
                  <div className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 space-y-2.5">
                    <div className="flex justify-between items-center">
                      <div>
                        <span className="font-bold text-xs text-white block">
                          {selectedLotId === 'Lot A' ? pt.lotNameA : selectedLotId === 'Lot B' ? pt.lotNameB : selectedLotId === 'Lot C' ? pt.lotNameC : pt.lotNameD}
                        </span>
                        <span className="text-[9px] text-slate-500 font-mono uppercase">
                          Gate {selectedLotId.slice(-1)}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                          (selectedLotId === 'Lot B' || selectedLotId === 'Lot D')
                            ? 'bg-red-950/40 text-red-400 border border-red-900/30'
                            : 'bg-emerald-950/40 text-emerald-400 border border-emerald-900/30'
                        }`}>
                          {(selectedLotId === 'Lot B' || selectedLotId === 'Lot D') ? pt.spaceFullLabel : pt.spaceOpenLabel}
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar of occupation */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[9px] font-mono text-slate-400">
                        <span>{pt.parkingSpotOccupancy}</span>
                        <span>
                          {selectedLotId === 'Lot A' && pt.spacesUsedLabel.replace('{used}', '142').replace('{total}', '300').replace('{pct}', '47')}
                          {selectedLotId === 'Lot B' && pt.spacesUsedLabel.replace('{used}', '396').replace('{total}', '400').replace('{pct}', '99')}
                          {selectedLotId === 'Lot C' && pt.spacesUsedLabel.replace('{used}', '105').replace('{total}', '350').replace('{pct}', '30')}
                          {selectedLotId === 'Lot D' && pt.spacesUsedLabel.replace('{used}', '250').replace('{total}', '250').replace('{pct}', '100')}
                        </span>
                      </div>
                      <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            (selectedLotId === 'Lot B' || selectedLotId === 'Lot D') ? 'bg-red-500' : 'bg-emerald-500'
                          }`}
                          style={{
                            width: 
                              selectedLotId === 'Lot A' ? '47%' :
                              selectedLotId === 'Lot B' ? '99%' :
                              selectedLotId === 'Lot C' ? '30%' :
                              '100%'
                          }}
                        />
                      </div>
                    </div>

                    {/* Spot grid */}
                    {reservedSpot && reservedSpot.startsWith(selectedLotId.slice(-1)) ? (
                      /* Active Reservation permit shown */
                      <div className="bg-slate-900 border border-indigo-500/20 p-3 rounded-lg text-center space-y-2">
                        <div className="flex justify-center">
                          <CheckCircle className="h-10 w-10 text-emerald-400 animate-bounce" />
                        </div>
                        <h5 className="font-bold text-xs text-white">{pt.parkingPermitActive}</h5>
                        <div className="bg-slate-950 p-2.5 rounded border border-slate-800 inline-block">
                          <span className="text-[8px] text-slate-500 block uppercase font-mono">{pt.assignedSpot}</span>
                          <span className="text-lg font-black text-indigo-400 font-mono tracking-wide">{reservedSpot}</span>
                        </div>
                        <p className="text-[9px] text-slate-400 leading-relaxed max-w-[200px] mx-auto">
                          {pt.permitAttendantTip}
                        </p>
                        
                        {/* QR barcode mock */}
                        <div className="bg-white p-2 rounded max-w-[150px] mx-auto flex flex-col items-center">
                          <div className="h-6 w-full bg-repeating-barcode" />
                          <span className="text-[6px] text-slate-900 font-mono font-bold mt-1">LOT-{selectedLotId.slice(-1)}-SPOT-{reservedSpot.split('-')[1]}</span>
                        </div>

                        <button
                          onClick={() => {
                            if (onShowToast) onShowToast(language === 'es' ? 'Reserva cancelada' : 'Reservation cancelled successfully', 'info');
                            setReservedSpot(null);
                          }}
                          className="text-[10px] text-red-400 hover:text-red-300 font-bold underline block mx-auto cursor-pointer"
                        >
                          {pt.cancelPermitButton}
                        </button>
                      </div>
                    ) : reserving ? (
                      <div className="py-6 flex flex-col items-center justify-center gap-1.5">
                        <Loader2 className="h-6 w-6 animate-spin text-indigo-400" />
                        <span className="text-[10px] text-slate-400 font-semibold animate-pulse">{language === 'es' ? 'Asignando espacio...' : 'Assigning best available slot...'}</span>
                      </div>
                    ) : (selectedLotId === 'Lot B' || selectedLotId === 'Lot D') ? (
                      <div className="p-3 bg-red-950/20 border border-red-900/30 rounded-lg text-center text-[10px] text-red-300 space-y-1">
                        <p className="font-bold">{pt.lotFullWarning.replace('{lot}', selectedLotId === 'Lot B' ? pt.lotNameB : pt.lotNameD)}</p>
                      </div>
                    ) : (
                      /* Grid of individual spaces to pick from */
                      <div className="space-y-2 pt-1">
                        <span className="text-[9px] text-slate-400 font-bold block">{pt.parkingSpotHeader.replace('{lot}', selectedLotId === 'Lot A' ? pt.lotNameA : pt.lotNameC)}</span>
                        
                        <div className="grid grid-cols-6 gap-1">
                          {Array.from({ length: 12 }).map((_, idx) => {
                            const spotNum = idx + 1;
                            const isReservedByOther = spotNum % 3 === 0; // Simulated occupied spots
                            const spotId = `${selectedLotId.slice(-1)}-${spotNum}`;
                            
                            return (
                              <button
                                key={spotNum}
                                disabled={isReservedByOther}
                                onClick={() => {
                                  setReserving(true);
                                  setTimeout(() => {
                                    setReservedSpot(spotId);
                                    setReserving(false);
                                    if (onShowToast) onShowToast(language === 'es' ? `Espacio ${spotId} reservado` : `Successfully reserved spot ${spotId}!`, 'success');
                                  }, 1000);
                                }}
                                className={`py-1.5 rounded text-[8px] font-bold font-mono border transition-all flex flex-col items-center justify-center ${
                                  isReservedByOther
                                    ? 'bg-slate-900/40 text-slate-600 border-slate-950 cursor-not-allowed opacity-40'
                                    : 'bg-emerald-950/30 text-emerald-400 border-emerald-900/40 hover:bg-emerald-900/30 cursor-pointer'
                                }`}
                              >
                                <span>{spotId}</span>
                                <span className="text-[6px] font-sans opacity-70">
                                  {isReservedByOther ? pt.spaceFullLabel : pt.spaceOpenLabel}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                        <span className="text-[8px] text-slate-500 block italic">{pt.gridSpotTip.replace('{lot}', selectedLotId.slice(-1))}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB 4: Smart Concierge AI chatbot */}
            {activeTab === 'chat' && (
              <div className="flex flex-col h-[400px]">
                {/* Options and Toggles Toolbar */}
                <div className="bg-slate-950/80 p-2 rounded-xl border border-slate-850 mb-2 space-y-1.5 text-[10px]">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-400">{t.conciergeModel}</span>
                    <select
                      value={selectedModel}
                      onChange={(e: any) => setSelectedModel(e.target.value)}
                      className="bg-slate-900 border border-slate-800 text-[9px] text-emerald-400 font-bold px-1.5 py-0.5 rounded focus:outline-none"
                    >
                      <option value="gemini-3.1-flash-lite">Lite (Fast Tasks)</option>
                      <option value="gemini-3.1-flash-lite">Flash (General)</option>
                      <option value="gemini-3.1-pro-preview">Pro (Deep Intel)</option>
                    </select>
                  </div>
                  <div className="flex justify-between items-center pt-0.5">
                    <div className="flex gap-2">
                      <label className="flex items-center gap-1 text-[9px] text-slate-400 cursor-pointer select-none hover:text-white">
                        <input
                          type="checkbox"
                          checked={useSearchGrounding}
                          onChange={(e) => setUseSearchGrounding(e.target.checked)}
                          className="rounded border-slate-800 bg-slate-950 text-emerald-600 focus:ring-0 h-2.5 w-2.5"
                        />
                        <span>{t.searchLabel}</span>
                      </label>
                      <label className="flex items-center gap-1 text-[9px] text-slate-400 cursor-pointer select-none hover:text-white">
                        <input
                          type="checkbox"
                          checked={useMapsGrounding}
                          onChange={(e) => setUseMapsGrounding(e.target.checked)}
                          className="rounded border-slate-800 bg-slate-950 text-emerald-600 focus:ring-0 h-2.5 w-2.5"
                        />
                        <span>{t.mapsLabel}</span>
                      </label>
                    </div>
                    <button
                      onClick={() => setVoiceEnabled(!voiceEnabled)}
                      className={`flex items-center gap-0.5 px-1 py-0.5 rounded text-[8px] font-bold border transition-colors ${
                        voiceEnabled 
                          ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-400' 
                          : 'bg-slate-900 border-slate-800 text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      <Volume2 className="h-2.5 w-2.5" />
                      <span>{voiceEnabled ? t.voiceOn : t.voiceOff}</span>
                    </button>
                  </div>
                </div>

                {/* Chat Scroll area */}
                <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 text-[11px] pb-2">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${
                        msg.sender === 'user' ? 'items-end' : 'items-start'
                      }`}
                    >
                      {msg.sender === 'agent' && (
                        <span className="text-[8px] text-emerald-400 font-bold uppercase tracking-wider mb-0.5">
                          {msg.agentName}
                        </span>
                      )}
                      <div
                        className={`p-2 rounded-lg max-w-[85%] leading-normal ${
                          msg.sender === 'user'
                            ? 'bg-emerald-600 text-white rounded-tr-none'
                            : 'bg-slate-950 border border-slate-800 text-slate-300 rounded-tl-none'
                        }`}
                      >
                        {msg.text}

                        {/* Render Search & Maps Grounding Chunk references if present */}
                        {msg.sender === 'agent' && msg.chunks && msg.chunks.length > 0 && (
                          <div className="mt-1.5 pt-1 border-t border-slate-850 text-[8px] text-slate-400 space-y-0.5">
                            <span className="font-bold uppercase font-mono block">References:</span>
                            {msg.chunks.map((chunk: any, ci: number) => {
                              const title = chunk.web?.title || chunk.maps?.title || `Link #${ci + 1}`;
                              const uri = chunk.web?.uri || chunk.maps?.uri;
                              if (!uri) return null;
                              return (
                                <a 
                                  key={ci} 
                                  href={uri} 
                                  target="_blank" 
                                  rel="noopener noreferrer" 
                                  className="block hover:text-emerald-400 truncate text-emerald-500 underline"
                                >
                                  🔗 {title}
                                </a>
                              );
                            })}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span className="text-[8px] text-slate-500 font-mono">{msg.timestamp}</span>
                        {msg.sender === 'agent' && (
                          <button
                            onClick={() => {
                              fetch('/api/gemini/voice-assistant', {
                                  method: 'POST',
                                  headers: { 'Content-Type': 'application/json' },
                                  body: JSON.stringify({ prompt: msg.text, voiceName: 'Puck' })
                                })
                                .then(r => r.json())
                                .then(d => {
                                  if (d.audioBase64) playPcmAudio(d.audioBase64);
                                });
                            }}
                            className="text-[8px] text-slate-500 hover:text-emerald-400 flex items-center gap-0.5"
                            title="Speak response"
                          >
                            <Volume2 className="h-2 w-2" />
                            <span>{t.speakButton}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                  {loadingChat && (
                    <div className="flex items-center gap-1 text-[9px] text-slate-500 italic animate-pulse pl-1">
                      <Sparkles className="h-2.5 w-2.5 animate-spin text-emerald-400" />
                      {t.thinking}
                    </div>
                  )}
                </div>

                {/* Copilot Suggested Actions */}
                <div className="py-1.5 flex flex-wrap gap-1 border-t border-slate-900 select-none">
                  <span className="text-[8px] text-slate-500 block w-full uppercase font-mono tracking-wide mb-0.5">
                    {language === 'es' ? 'Copilot Tareas Rápidas:' : 'Copilot Quick Tasks:'}
                  </span>
                  <button
                    type="button"
                    onClick={() => handleCopilotAction(copilotPrompts[language]?.food || copilotPrompts['en'].food)}
                    className="bg-emerald-950/40 text-emerald-300 border border-emerald-900/30 text-[9px] px-1.5 py-0.5 rounded hover:bg-emerald-900/30 font-semibold cursor-pointer"
                  >
                    🌮 {language === 'es' ? 'Comida recomendada' : 'Best Food Queue'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopilotAction(copilotPrompts[language]?.parking || copilotPrompts['en'].parking)}
                    className="bg-indigo-950/40 text-indigo-300 border border-indigo-900/30 text-[9px] px-1.5 py-0.5 rounded hover:bg-indigo-900/30 font-semibold cursor-pointer"
                  >
                    🚗 {language === 'es' ? 'Mejor Estacionamiento' : 'Best Parking Lot'}
                  </button>
                   <button
                    type="button"
                    onClick={handleStartSeatFinderFlow}
                    className="bg-blue-950/40 text-blue-300 border border-blue-900/30 text-[9px] px-1.5 py-0.5 rounded hover:bg-blue-900/30 font-semibold cursor-pointer"
                  >
                    🎫 {language === 'es' ? 'Guía de Asiento' : 'Seat Finder'}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCopilotAction(copilotPrompts[language]?.facility || copilotPrompts['en'].facility)}
                    className="bg-slate-900 text-slate-300 border border-slate-800 text-[9px] px-1.5 py-0.5 rounded hover:bg-slate-800 font-semibold cursor-pointer"
                  >
                    🚽 {language === 'es' ? 'Baños y Servicios' : 'Restrooms'}
                  </button>
                </div>

                {/* Message input */}
                <form onSubmit={handleSendMessage} className="flex gap-1 border-t border-slate-800 pt-2">
                  <button
                    type="button"
                    onClick={startDictation}
                    className={`p-1.5 rounded-lg border transition-colors ${
                      isDictating 
                        ? 'bg-red-950/60 border-red-500/40 text-red-400 animate-pulse' 
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                    }`}
                    title="Dictate message"
                  >
                    <Mic className="h-3.5 w-3.5" />
                  </button>
                  <input
                    type="text"
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    placeholder={t.placeholder}
                    disabled={loadingChat}
                    className="flex-1 bg-slate-950 border border-slate-800 rounded-lg text-xs px-2 py-1 text-slate-200 placeholder-slate-600 focus:outline-none focus:border-emerald-500"
                  />
                  <button
                    type="submit"
                    disabled={loadingChat || !inputText.trim()}
                    className="bg-emerald-600 hover:bg-emerald-500 text-white p-1.5 rounded-lg transition-colors flex items-center justify-center disabled:opacity-40"
                  >
                    <Send className="h-3.5 w-3.5" />
                  </button>
                </form>
              </div>
            )}

          </div>

          {/* Smartphone Footer Navigation bar */}
          <div className="bg-slate-950/95 border-t border-slate-800/80 px-2 py-2 flex justify-around select-none">
            <button 
              onClick={() => setActiveTab('ticket')}
              className={`flex flex-col items-center gap-0.5 ${activeTab === 'ticket' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Ticket className="h-4 w-4" />
              <span className="text-[8px] font-medium">{t.ticket}</span>
            </button>
            <button 
              onClick={() => setActiveTab('food')}
              className={`flex flex-col items-center gap-0.5 ${activeTab === 'food' ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Coffee className="h-4 w-4" />
              <span className="text-[8px] font-medium">{t.concessions}</span>
            </button>
            <button 
              onClick={() => setActiveTab('parking')}
              className={`flex flex-col items-center gap-0.5 ${activeTab === 'parking' ? 'text-indigo-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Car className="h-4 w-4" />
              <span className="text-[8px] font-medium">{t.parking}</span>
            </button>
            <button 
              onClick={() => setActiveTab('chat')}
              className={`flex flex-col items-center gap-0.5 ${activeTab === 'chat' ? 'text-emerald-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <Sparkles className="h-4 w-4 animate-pulse" />
              <span className="text-[8px] font-medium">{t.aiConcierge}</span>
            </button>
            <button 
              onClick={() => setActiveTab('report')}
              className={`flex flex-col items-center gap-0.5 ${activeTab === 'report' ? 'text-amber-400' : 'text-slate-500 hover:text-slate-300'}`}
            >
              <AlertTriangle className="h-4 w-4" />
              <span className="text-[8px] font-medium">{t.quickReport}</span>
            </button>
          </div>

        </div>

        {/* Smartphone Home Swipe Indicator */}
        <div className="h-4 w-full bg-slate-950 flex justify-center items-center select-none z-20">
          <div className="w-24 h-1 bg-slate-800 rounded-full" />
        </div>

      </div>

    </div>
  );
}
