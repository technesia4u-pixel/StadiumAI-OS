/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { LanguageCode } from './translations';

export interface ParkingTranslation {
  lotNameA: string;
  lotNameB: string;
  lotNameC: string;
  lotNameD: string;
  spotsOpen: string;
  parkingPermitActive: string;
  assignedSpot: string;
  parkingInstructionsA: string;
  parkingInstructionsB: string;
  parkingInstructionsC: string;
  parkingInstructionsD: string;
  parkingSpotHeader: string;
  parkingSpotOccupancy: string;
  availableSpaces: string;
  lotFullWarning: string;
  permitAttendantTip: string;
  cancelPermitButton: string;
  spaceOpenLabel: string;
  spaceFullLabel: string;
  spacesUsedLabel: string;
  gridSpotTip: string;
  parkingTip: string;
}

export const parkingTranslations: Record<LanguageCode, ParkingTranslation> = {
  en: {
    lotNameA: 'Lot A (North)',
    lotNameB: 'Lot B (East)',
    lotNameC: 'Lot C (South)',
    lotNameD: 'Lot D (West)',
    spotsOpen: 'Spots Open',
    parkingPermitActive: 'Your Parking Permit is Active!',
    assignedSpot: 'Assigned Spot',
    parkingInstructionsA: 'Lot A is open and available. Walk 1 min to Gate A entry point.',
    parkingInstructionsB: 'Warning: Lot B (closest to Gate B) is currently FULL. We suggest parking in Lot A. Shuttle B (every 3 mins) runs directly to Gate B entrance.',
    parkingInstructionsC: 'Lot C is open and available. Walk 1 min to Gate C entry point.',
    parkingInstructionsD: 'Warning: Lot D (closest to Gate D) is currently FULL. We suggest parking in Lot C. Walk 4 mins along the illuminated path directly to Gate D.',
    parkingSpotHeader: 'Available Spaces in {lot}:',
    parkingSpotOccupancy: 'Occupancy Status:',
    availableSpaces: 'Available Spaces:',
    lotFullWarning: '⚠️ All slots in {lot} are completely full. Please use another lot as suggested.',
    permitAttendantTip: 'Show this ticket to the parking attendants. Place near your windshield.',
    cancelPermitButton: 'Cancel Permit',
    spaceOpenLabel: 'Open',
    spaceFullLabel: 'Full',
    spacesUsedLabel: '{used} / {total} spaces used ({pct}%)',
    gridSpotTip: 'Tap on any available slot (e.g. {lot}-1) to reserve it instantly.',
    parkingTip: '💡 Tip: Tap any parking lot block on the map above to inspect vacancies and reserve!'
  },
  es: {
    lotNameA: 'Lote A (Norte)',
    lotNameB: 'Lote B (Este)',
    lotNameC: 'Lote C (Sur)',
    lotNameD: 'Lote D (Oeste)',
    spotsOpen: 'Espacios Libres',
    parkingPermitActive: '¡Su Permiso de Parqueo está Activo!',
    assignedSpot: 'Espacio Asignado',
    parkingInstructionsA: 'El Lote A está abierto y disponible. Camine 1 min a la entrada de la Puerta A.',
    parkingInstructionsB: 'Advertencia: El Lote B (más cercano a la Puerta B) está LLENO. Sugerimos estacionar en el Lote A. El Transbordador B (cada 3 min) va directo a la Puerta B.',
    parkingInstructionsC: 'El Lote C está abierto y disponible. Camine 1 min a la entrada de la Puerta C.',
    parkingInstructionsD: 'Advertencia: El Lote D (más cercano a la Puerta D) está LLENO. Sugerimos estacionar en el Lote C. Camine 4 min por el sendero iluminado directo a la Puerta D.',
    parkingSpotHeader: 'Espacios Disponibles en {lot}:',
    parkingSpotOccupancy: 'Estado de Ocupación:',
    availableSpaces: 'Espacios Disponibles:',
    lotFullWarning: '⚠️ Todos los espacios en el {lot} están completamente llenos. Por favor use otro lote como se sugiere.',
    permitAttendantTip: 'Muestre este boleto a los asistentes de estacionamiento. Colóquelo cerca de su parabrisas.',
    cancelPermitButton: 'Cancelar Permiso',
    spaceOpenLabel: 'Abierto',
    spaceFullLabel: 'Lleno',
    spacesUsedLabel: '{used} / {total} espacios usados ({pct}%)',
    gridSpotTip: 'Toque cualquier espacio disponible (ej. {lot}-1) para reservarlo al instante.',
    parkingTip: '💡 Consejo: ¡Toque cualquier bloque de estacionamiento en el mapa de arriba para ver vacantes y reservar!'
  },
  fr: {
    lotNameA: 'Parking A (Nord)',
    lotNameB: 'Parking B (Est)',
    lotNameC: 'Parking C (Sud)',
    lotNameD: 'Parking D (Ouest)',
    spotsOpen: 'Places Libres',
    parkingPermitActive: 'Votre permis de stationnement est actif !',
    assignedSpot: 'Place Assignée',
    parkingInstructionsA: 'Le Parking A est ouvert et disponible. Marchez 1 min jusqu’à la Porte A.',
    parkingInstructionsB: 'Attention : Le Parking B (le plus proche de la Porte B) est COMPLET. Nous vous conseillons de vous garer au Parking A. La navette B (toutes les 3 min) dessert directement la Porte B.',
    parkingInstructionsC: 'Le Parking C est ouvert et disponible. Marchez 1 min jusqu’à la Porte C.',
    parkingInstructionsD: 'Attention : Le Parking D (le plus proche de la Porte D) est COMPLET. Nous vous conseillons de vous garer au Parking C. Marchez 4 min le long du chemin éclairé jusqu’à la Porte D.',
    parkingSpotHeader: 'Places disponibles dans le {lot} :',
    parkingSpotOccupancy: 'Occupation :',
    availableSpaces: 'Places Disponibles :',
    lotFullWarning: '⚠️ Toutes les places du {lot} sont complètes. Veuillez utiliser un autre parking.',
    permitAttendantTip: 'Présentez ce ticket aux agents de stationnement. Placez-le près de votre pare-brise.',
    cancelPermitButton: 'Annuler le Permis',
    spaceOpenLabel: 'Libre',
    spaceFullLabel: 'Complet',
    spacesUsedLabel: '{used} / {total} places utilisées ({pct}%)',
    gridSpotTip: 'Appuyez sur une place libre (ex: {lot}-1) pour la réserver instantanément.',
    parkingTip: '💡 Astuce : Appuyez sur n’importe quel bloc de parking sur la carte ci-dessus pour inspecter les disponibilités et réserver !'
  },
  de: {
    lotNameA: 'Parkplatz A (Nord)',
    lotNameB: 'Parkplatz B (Ost)',
    lotNameC: 'Parkplatz C (Süd)',
    lotNameD: 'Parkplatz D (West)',
    spotsOpen: 'Freie Plätze',
    parkingPermitActive: 'Ihr Parkausweis ist aktiv!',
    assignedSpot: 'Zugewiesener Platz',
    parkingInstructionsA: 'Parkplatz A ist geöffnet und verfügbar. Gehen Sie 1 Min. zum Eingang Tor A.',
    parkingInstructionsB: 'Warnung: Parkplatz B (am nächsten zu Tor B) ist derzeit VOLL. Wir empfehlen, auf Parkplatz A zu parken. Shuttle B (alle 3 Min.) fährt direkt zum Tor B.',
    parkingInstructionsC: 'Parkplatz C ist geöffnet und verfügbar. Gehen Sie 1 Min. zum Eingang Tor C.',
    parkingInstructionsD: 'Warnung: Parkplatz D (am nächsten zu Tor D) ist derzeit VOLL. Wir empfehlen, auf Parkplatz C zu parken. Gehen Sie 4 Min. entlang des beleuchteten Pfades direkt zu Tor D.',
    parkingSpotHeader: 'Verfügbare Plätze in {lot}:',
    parkingSpotOccupancy: 'Belegung:',
    availableSpaces: 'Verfügbare Plätze:',
    lotFullWarning: '⚠️ Alle Plätze in {lot} sind vollständig belegt. Bitte weichen Sie auf einen anderen Parkplatz aus.',
    permitAttendantTip: 'Zeigen Sie dieses Ticket dem Parkpersonal. Platzieren Sie es an Ihrer Windschutzscheibe.',
    cancelPermitButton: 'Parkausweis Stornieren',
    spaceOpenLabel: 'Frei',
    spaceFullLabel: 'Voll',
    spacesUsedLabel: '{used} / {total} Plätze belegt ({pct}%)',
    gridSpotTip: 'Tippen Sie auf einen freien Platz (z. B. {lot}-1), um ihn sofort zu reservieren.',
    parkingTip: '💡 Tipp: Tippen Sie auf einen Parkplatzbereich auf der Karte oben, um freie Plätze zu sehen und zu reservieren!'
  },
  ar: {
    lotNameA: 'موقف أ (الشمالي)',
    lotNameB: 'موقف ب (الشرقي)',
    lotNameC: 'موقف ج (الجنوبي)',
    lotNameD: 'موقف د (الغربي)',
    spotsOpen: 'أماكن شاغرة',
    parkingPermitActive: 'تصريح الموقف الخاص بك نشط!',
    assignedSpot: 'المكان المخصص',
    parkingInstructionsA: 'الموقف أ مفتوح ومتاح. سر لمدة دقيقة واحدة إلى البوابة أ.',
    parkingInstructionsB: 'تنبيه: الموقف ب (الأقرب للبوابة ب) ممتلئ حالياً. نقترح الوقوف في الموقف أ. الحافلة ب (كل 3 دقائق) تصل مباشرة للبوابة ب.',
    parkingInstructionsC: 'الموقف ج مفتوح ومتاح. سر لمدة دقيقة واحدة إلى البوابة ج.',
    parkingInstructionsD: 'تنبيه: الموقف د (الأقرب للبوابة د) ممتلئ حالياً. نقترح الوقوف في الموقف ج. سر لمدة 4 دقائق عبر الممر المضيء إلى البوابة د.',
    parkingSpotHeader: 'الأماكن المتاحة في {lot}:',
    parkingSpotOccupancy: 'حالة الإشغال:',
    availableSpaces: 'الأماكن المتاحة:',
    lotFullWarning: '⚠️ جميع الأماكن في {lot} ممتلئة تماماً. يرجى استخدام موقف آخر كما هو موضح أعلاه.',
    permitAttendantTip: 'اعرض هذه التذكرة لمسؤولي المواقف. ضعها بالقرب من الزجاج الأمامي.',
    cancelPermitButton: 'إلغاء التصريح',
    spaceOpenLabel: 'متاح',
    spaceFullLabel: 'ممتلئ',
    spacesUsedLabel: 'تم استخدام {used} / {total} من الأماكن ({pct}%)',
    gridSpotTip: 'انقر على أي مكان متاح (مثال: {lot}-1) لحجزه فوراً.',
    parkingTip: '💡 نصيحة: انقر على أي منطقة مواقف في الخريطة أعلاه لمعاينة الأماكن الشاغرة والحجز!'
  },
  ja: {
    lotNameA: '駐車場 A (北)',
    lotNameB: '駐車場 B (東)',
    lotNameC: '駐車場 C (南)',
    lotNameD: '駐車場 D (西)',
    spotsOpen: '空きあり',
    parkingPermitActive: '駐車許可証が有効です！',
    assignedSpot: '指定駐車スペース',
    parkingInstructionsA: '駐車場Aは利用可能です。ゲートAの入り口まで徒歩1分。',
    parkingInstructionsB: '警告：ゲートBに最も近い駐車場Bは現在【満車】です。駐車場Aのご利用をお勧めします。シャトルバスB（3分間隔）がゲートBまで直行します。',
    parkingInstructionsC: '駐車場Cは利用可能です。ゲートCの入り口まで徒歩1分。',
    parkingInstructionsD: '警告：ゲートDに最も近い駐車場Dは現在【満車】です。駐車場Cのご利用をお勧めします。ライトアップされた遊歩道を歩いてゲートDまで4分。',
    parkingSpotHeader: '{lot}の空き状況：',
    parkingSpotOccupancy: '混雑状況：',
    availableSpaces: '利用可能なスペース：',
    lotFullWarning: '⚠️ {lot}は完全に満車です。上記の推奨に従って、別の駐車場をご利用ください。',
    permitAttendantTip: 'このチケットを係員に提示し、フロントガラスの近くに置いてください。',
    cancelPermitButton: '許可証をキャンセル',
    spaceOpenLabel: '空き',
    spaceFullLabel: '満車',
    spacesUsedLabel: '{total}台中 {used}台駐車中 ({pct}%)',
    gridSpotTip: '空いているスペース（例: {lot}-1）をタップすると、すぐに予約できます。',
    parkingTip: '💡 ヒント：上の地図の駐車場ブロックをタップすると、空き状況の確認と予約ができます！'
  },
  nl: {
    lotNameA: 'Parkeerterrein A (Noord)',
    lotNameB: 'Parkeerterrein B (Oost)',
    lotNameC: 'Parkeerterrein C (Zuid)',
    lotNameD: 'Parkeerterrein D (West)',
    spotsOpen: 'Vrije Plaatsen',
    parkingPermitActive: 'Uw parkeervergunning is actief!',
    assignedSpot: 'Toegewezen Plek',
    parkingInstructionsA: 'Parkeerterrein A is open en beschikbaar. Loop 1 minuut naar ingang Gate A.',
    parkingInstructionsB: 'Waarschuwing: Parkeerterrein B (dichtst bij Gate B) is momenteel VOL. We raden aan om op Parkeerterrein A te parkeren. Pendelbus B (elke 3 min) rijdt rechtstreeks naar Gate B.',
    parkingInstructionsC: 'Parkeerterrein C is open en beschikbaar. Loop 1 minuut naar ingang Gate C.',
    parkingInstructionsD: 'Waarschuwing: Parkeerterrein D (dichtst bij Gate D) is momenteel VOL. We raden aan om op Parkeerterrein C te parkeren. Loop 4 min via het verlichte pad naar Gate D.',
    parkingSpotHeader: 'Beschikbare plekken in {lot}:',
    parkingSpotOccupancy: 'Bezetting:',
    availableSpaces: 'Beschikbare plekken:',
    lotFullWarning: '⚠️ Alle plekken in {lot} zijn volledig bezet. Gebruik een ander parkeerterrein zoals hierboven voorgesteld.',
    permitAttendantTip: 'Laat dit ticket zien aan de parkeerwachters. Leg het achter uw voorruit.',
    cancelPermitButton: 'Annuleer Vergunning',
    spaceOpenLabel: 'Vrij',
    spaceFullLabel: 'Vol',
    spacesUsedLabel: '{used} / {total} plekken bezet ({pct}%)',
    gridSpotTip: 'Tik op een vrije plek (bijv. {lot}-1) om deze direct te reserveren.',
    parkingTip: '💡 Tip: Tik op een parkeerblok op de kaart hierboven om de beschikbaarheid te bekijken en te reserveren!'
  },
  hi: {
    lotNameA: 'पार्किंग क्षेत्र A (उत्तर)',
    lotNameB: 'पार्किंग क्षेत्र B (पूर्व)',
    lotNameC: 'पार्किंग क्षेत्र C (दक्षिण)',
    lotNameD: 'पार्किंग क्षेत्र D (पश्चिम)',
    spotsOpen: 'खाली स्थान',
    parkingPermitActive: 'आपका पार्किंग परमिट सक्रिय है!',
    assignedSpot: 'आवंटित स्थान',
    parkingInstructionsA: 'पार्किंग क्षेत्र A खुला और उपलब्ध है। गेट A प्रवेश द्वार तक 1 मिनट पैदल चलें।',
    parkingInstructionsB: 'चेतावनी: पार्किंग क्षेत्र B (गेट B के सबसे करीब) वर्तमान में भरा हुआ है। हम पार्किंग क्षेत्र A में पार्क करने का सुझाव देते हैं। शटल B (हर 3 मिनट में) सीधे गेट B प्रवेश द्वार तक चलती है।',
    parkingInstructionsC: 'पार्किंग क्षेत्र C खुला और उपलब्ध है। गेट C प्रवेश द्वार तक 1 मिनट पैदल चलें।',
    parkingInstructionsD: 'चेतावनी: पार्किंग क्षेत्र D (गेट D के सबसे करीब) वर्तमान में भरा हुआ है। हम पार्किंग क्षेत्र C में पार्क करने का सुझाव देते हैं। रोशन पथ के माध्यम से सीधे गेट D तक 4 मिनट पैदल चलें।',
    parkingSpotHeader: '{lot} में उपलब्ध स्थान:',
    parkingSpotOccupancy: 'पार्किंग स्थिति:',
    availableSpaces: 'उपलब्ध स्थान:',
    lotFullWarning: '⚠️ {lot} के सभी स्थान पूरी तरह से भरे हुए हैं। कृपया ऊपर दिए गए सुझाव के अनुसार दूसरे क्षेत्र का उपयोग करें।',
    permitAttendantTip: 'यह टिकट पार्किंग सहायकों को दिखाएं। अपने विंडशील्ड के पास रखें।',
    cancelPermitButton: 'परमिट रद्द करें',
    spaceOpenLabel: 'खाली',
    spaceFullLabel: 'भरा हुआ',
    spacesUsedLabel: '{total} में से {used} स्थान उपयोग किए गए ({pct}%)',
    gridSpotTip: 'तुरंत आरक्षित करने के लिए किसी भी उपलब्ध स्थान (उदा. {lot}-1) पर टैप करें।',
    parkingTip: '💡 सुझाव: रिक्तियों का निरीक्षण करने और आरक्षित करने के लिए ऊपर दिए गए मानचित्र पर किसी भी पार्किंग ब्लॉक पर टैप करें!'
  },
  te: {
    lotNameA: 'పార్కింగ్ లాట్ A (ఉత్తరం)',
    lotNameB: 'పార్కింగ్ లాట్ B (తూర్పు)',
    lotNameC: 'పార్కింగ్ లాట్ C (దక్షిణం)',
    lotNameD: 'పార్కింగ్ లాట్ D (పడమర)',
    spotsOpen: 'ఖాళీలు ఉన్నాయి',
    parkingPermitActive: 'మీ పార్కింగ్ పర్మిట్ యాక్టివ్‌గా ఉంది!',
    assignedSpot: 'కేటాయించిన స్థలం',
    parkingInstructionsA: 'పార్కింగ్ లాట్ A తెరిచి ఉంది. గేట్ A ప్రవేశ ద్వారానికి 1 నిమిషం నడవండి.',
    parkingInstructionsB: 'హెచ్చరిక: గేట్ B కి దగ్గరగా ఉన్న పార్కింగ్ లాట్ B ప్రస్తుతం నిండిపోయింది. పార్కింగ్ లాట్ A లో పార్క్ చేయాల్సిందిగా సూచిస్తున్నాము. షటిల్ B (ప్రతి 3 నిమిషాలకు) నేరుగా గేట్ B ప్రవేశ ద్వారానికి నడుస్తుంది.',
    parkingInstructionsC: 'పార్కింగ్ లాట్ C తెరిచి ఉంది. గేట్ C ప్రవేశ ద్వారానికి 1 నిమిషం నడవండి.',
    parkingInstructionsD: 'హెచ్చరిక: గేట్ D కి దగ్గరగా ఉన్న పార్కింగ్ లాట్ D ప్రస్తుతం నిండిపోయింది. పార్కింగ్ లాట్ C లో పార్క్ చేయాల్సిందిగా సూచిస్తున్నాము. వెలుతురు ఉన్న దారి గుండా నేరుగా గేట్ D కి 4 నిమిషాలు నడవండి.',
    parkingSpotHeader: '{lot} లో అందుబాటులో ఉన్న స్థలాలు:',
    parkingSpotOccupancy: 'ఆక్యుపెన్సీ స్థితి:',
    availableSpaces: 'అందుబాటులో ఉన్న స్థలాలు:',
    lotFullWarning: '⚠️ {lot} లోని అన్ని స్థలాలు పూర్తిగా నిండిపోయాయి. దయచేసి పైన సూచించిన విధంగా వేరే లాట్ ఉపయోగించండి.',
    permitAttendantTip: 'ఈ టికెట్‌ను పార్కింగ్ అటెندెంట్‌లకు చూపించండి. మీ విండ్‌షీల్డ్ దగ్గర ఉంచండి.',
    cancelPermitButton: 'పర్మిట్ రద్దు చేయండి',
    spaceOpenLabel: 'ఖాళీ',
    spaceFullLabel: 'నిండింది',
    spacesUsedLabel: '{total} స్థలాలలో {used} ఉపయోగించబడ్డాయి ({pct}%)',
    gridSpotTip: 'వెంటనే రిజర్వ్ చేయడానికి ఏదైనా ఖాళీ స్థలాన్ని (ఉదా. {lot}-1) ట్యాప్ చేయండి.',
    parkingTip: '💡 చిట్కా: ఖాళీలను పరిశీలించడానికి మరియు రిజర్వ్ చేయడానికి పైన ఉన్న పార్కింగ్ లాట్ మ్యాప్‌ను ట్యాప్ చేయండి!'
  },
  ta: {
    lotNameA: 'பார்க்கிங் பகுதி A (வடக்கு)',
    lotNameB: 'பார்க்கிங் பகுதி B (கிழக்கு)',
    lotNameC: 'பார்க்கிங் பகுதி C (தெற்கு)',
    lotNameD: 'பார்க்கிங் பகுதி D (மேற்கு)',
    spotsOpen: 'இடங்கள் உள்ளன',
    parkingPermitActive: 'உங்கள் பார்க்கிங் அனுமதி சீட்டு செயல்பாட்டில் உள்ளது!',
    assignedSpot: 'ஒதுக்கப்பட்ட இடம்',
    parkingInstructionsA: 'பார்க்கிங் பகுதி A திறந்து வைக்கப்பட்டுள்ளது. கேட் A நுழைவாயிலுக்கு 1 நிமிடம் நடக்கவும்.',
    parkingInstructionsB: 'எச்சரிக்கை: கேட் B-க்கு மிக அருகிலுள்ள பார்க்கிங் பகுதி B தற்போது முழுமையாக நிறைந்துள்ளது. பார்க்கிங் பகுதி A-வில் நிறுத்த பரிந்துரைக்கிறோம். ஷட்டில் B (ஒவ்வொரு 3 நிமிடத்திற்கும்) கேட் B நுழைவாயிலுக்கு நேரடியாக இயங்குகிறது.',
    parkingInstructionsC: 'பார்க்கிங் பகுதி C திறந்து வைக்கப்பட்டுள்ளது. கேட் C நுழைவாயிலுக்கு 1 நிமிடம் நடக்கவும்.',
    parkingInstructionsD: 'எச்சரிக்கை: கேட் D-க்கு மிக அருகிலுள்ள பார்க்கிங் பகுதி D தற்போது முழுமையாக நிறைந்துள்ளது. பார்க்கிங் பகுதி C-வில் நிறுத்த பரிந்துரைக்கிறோம். ஒளிரும் பாதையில் கேட் D-க்கு நேரடியாக 4 நிமிடங்கள் நடக்கவும்.',
    parkingSpotHeader: '{lot}-ல் உள்ள காலி இடங்கள்:',
    parkingSpotOccupancy: 'நிரப்பப்பட்ட நிலை:',
    availableSpaces: 'கிடைக்கும் இடங்கள்:',
    lotFullWarning: '⚠️ {lot}-ல் உள்ள அனைத்து இடங்களும் முழுமையாக நிறைந்துவிட்டன. மேலே பரிந்துரைத்தபடி மாற்றுப் பகுதியைப் பயன்படுத்தவும்.',
    permitAttendantTip: 'இந்த சீட்டை பார்க்கிங் ஊழியர்களிடம் காட்டவும். உங்கள் காரின் விண்ட்ஷீல்டுக்கு அருகில் வைக்கவும்.',
    cancelPermitButton: 'அனுமதியை ரத்து செய்',
    spaceOpenLabel: 'காலி',
    spaceFullLabel: 'நிறைந்தது',
    spacesUsedLabel: '{total} இடங்களில் {used} பயன்படுத்தப்பட்டுள்ளது ({pct}%)',
    gridSpotTip: 'உடனடியாக முன்பதிவு செய்ய ஏதேனும் ஒரு காலி இடத்தை (உதாரணம்: {lot}-1) தட்டவும்.',
    parkingTip: '💡 குறிப்பு: காலியிடங்களைப் பார்க்கவும் முன்பதிவு செய்யவும் மேலே உள்ள பார்க்கிங் வரைபடத்தைத் தட்டவும்!'
  }
};
