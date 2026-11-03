import { QuestionItem } from './rules';

export const BUILTIN_QUESTIONS: QuestionItem[] = [
  // ==========================================
  // TIER 1: EASY (Levels 1 - 5) - 20 Questions
  // ==========================================
  {
    id: 't1_01',
    tier: 1,
    correctIndex: 1,
    ar: {
      question: 'ما هو الكوكب الملقب بـ «الكوكب الأحمر» في المجموعة الشمسية؟',
      options: ['الزهرة', 'المريخ', 'المشتري', 'عطارد'],
      category: 'الفضاء والفلك',
    },
    en: {
      question: 'Which planet in our solar system is known as the "Red Planet"?',
      options: ['Venus', 'Mars', 'Jupiter', 'Mercury'],
      category: 'Space & Astronomy',
    },
  },
  {
    id: 't1_02',
    tier: 1,
    correctIndex: 2,
    ar: {
      question: 'كم عدد القارات في العالم؟',
      options: ['5 قارات', '6 قارات', '7 قارات', '8 قارات'],
      category: 'جغرافيا',
    },
    en: {
      question: 'How many continents are there in the world?',
      options: ['5 Continents', '6 Continents', '7 Continents', '8 Continents'],
      category: 'Geography',
    },
  },
  {
    id: 't1_03',
    tier: 1,
    correctIndex: 0,
    ar: {
      question: 'ما هو أكبر محيط على سطح الكرة الأرضية؟',
      options: ['المحيط الهادئ', 'المحيط الأطلسي', 'المحيط الهندي', 'المحيط المتجمد الشمالي'],
      category: 'جغرافيا',
    },
    en: {
      question: 'What is the largest ocean on Earth?',
      options: ['Pacific Ocean', 'Atlantic Ocean', 'Indian Ocean', 'Arctic Ocean'],
      category: 'Geography',
    },
  },
  {
    id: 't1_04',
    tier: 1,
    correctIndex: 3,
    ar: {
      question: 'كم عدد لاعبي فريق كرة القدم الأساسيين داخل الملعب؟',
      options: ['9 لاعبين', '10 لاعبين', '12 لاعباً', '11 لاعباً'],
      category: 'رياضة',
    },
    en: {
      question: 'How many starting players are on the pitch for one football (soccer) team?',
      options: ['9 Players', '10 Players', '12 Players', '11 Players'],
      category: 'Sports',
    },
  },
  {
    id: 't1_05',
    tier: 1,
    correctIndex: 1,
    ar: {
      question: 'ما هو الغاز الذي يتنفسه الإنسان للبقاء على قيد الحياة؟',
      options: ['النيتروجين', 'الأكسجين', 'ثاني أكسيد الكربون', 'الهيليوم'],
      category: 'علوم',
    },
    en: {
      question: 'Which gas do humans need to breathe to survive?',
      options: ['Nitrogen', 'Oxygen', 'Carbon Dioxide', 'Helium'],
      category: 'Science',
    },
  },
  {
    id: 't1_06',
    tier: 1,
    correctIndex: 0,
    ar: {
      question: 'ما هي عاصمة جمهورية مصر العربية؟',
      options: ['القاهرة', 'الإسكندرية', 'الجيزة', 'الأقصر'],
      category: 'جغرافيا',
    },
    en: {
      question: 'What is the capital city of Egypt?',
      options: ['Cairo', 'Alexandria', 'Giza', 'Luxor'],
      category: 'Geography',
    },
  },
  {
    id: 't1_07',
    tier: 1,
    correctIndex: 2,
    ar: {
      question: 'كم عدد أيام السنة الكبيسة؟',
      options: ['364 يوماً', '365 يوماً', '366 يوماً', '367 يوماً'],
      category: 'معلومات عامة',
    },
    en: {
      question: 'How many days are there in a leap year?',
      options: ['364 Days', '365 Days', '366 Days', '367 Days'],
      category: 'General Knowledge',
    },
  },
  {
    id: 't1_08',
    tier: 1,
    correctIndex: 1,
    ar: {
      question: 'أي حيوان يُعرف بلقب «سفينة الصحراء»؟',
      options: ['الحصان العربي', 'الجمل', 'المها العربي', 'الصقر'],
      category: 'طبيعة',
    },
    en: {
      question: 'Which animal is famously known as the "Ship of the Desert"?',
      options: ['Arabian Horse', 'Camel', 'Arabian Oryx', 'Falcon'],
      category: 'Nature',
    },
  },
  {
    id: 't1_09',
    tier: 1,
    correctIndex: 3,
    ar: {
      question: 'ما هو الرمز الكيميائي للماء؟',
      options: ['CO2', 'O2', 'NaCl', 'H2O'],
      category: 'علوم',
    },
    en: {
      question: 'What is the chemical formula for water?',
      options: ['CO2', 'O2', 'NaCl', 'H2O'],
      category: 'Science',
    },
  },
  {
    id: 't1_10',
    tier: 1,
    correctIndex: 0,
    ar: {
      question: 'ما هو أصغر كوكب في مجموعتنا الشمسية؟',
      options: ['عطارد', 'المريخ', 'الزهرة', 'زحل'],
      category: 'الفضاء والفلك',
    },
    en: {
      question: 'What is the smallest planet in our solar system?',
      options: ['Mercury', 'Mars', 'Venus', 'Saturn'],
      category: 'Space & Astronomy',
    },
  },
  {
    id: 't1_11',
    tier: 1,
    correctIndex: 2,
    ar: {
      question: 'في أي دولة يقع برج إيفل الشهير؟',
      options: ['إيطاليا', 'إسبانيا', 'فرنسا', 'ألمانيا'],
      category: 'معالم عالمية',
    },
    en: {
      question: 'In which country is the famous Eiffel Tower located?',
      options: ['Italy', 'Spain', 'France', 'Germany'],
      category: 'World Landmarks',
    },
  },
  {
    id: 't1_12',
    tier: 1,
    correctIndex: 1,
    ar: {
      question: 'كم عدد ألوان قوس قزح؟',
      options: ['6 ألوان', '7 ألوان', '8 ألوان', '5 ألوان'],
      category: 'علوم',
    },
    en: {
      question: 'How many colors are in a traditional rainbow?',
      options: ['6 Colors', '7 Colors', '8 Colors', '5 Colors'],
      category: 'Science',
    },
  },
  {
    id: 't1_13',
    tier: 1,
    correctIndex: 3,
    ar: {
      question: 'ما هو أسرع حيوان بري في العالم؟',
      options: ['الأسد', 'الغزال', 'النمر', 'الفهد الصياد (الشيتا)'],
      category: 'طبيعة',
    },
    en: {
      question: 'What is the fastest land animal in the world?',
      options: ['Lion', 'Gazelle', 'Tiger', 'Cheetah'],
      category: 'Nature',
    },
  },
  {
    id: 't1_14',
    tier: 1,
    correctIndex: 0,
    ar: {
      question: 'ما هي العملة الرسمية في اليابان؟',
      options: ['الين', 'اليوان', 'الوون', 'الدولار'],
      category: 'اقتصاد وجغرافيا',
    },
    en: {
      question: 'What is the official currency of Japan?',
      options: ['Yen', 'Yuan', 'Won', 'Dollar'],
      category: 'Geography & Economy',
    },
  },
  {
    id: 't1_15',
    tier: 1,
    correctIndex: 2,
    ar: {
      question: 'أي فصل من فصول السنة تتساقط فيه أوراق الأشجار عادةً؟',
      options: ['الربيع', 'الصيف', 'الخريف', 'الشتاء'],
      category: 'طبيعة',
    },
    en: {
      question: 'During which season do leaves typically fall from deciduous trees?',
      options: ['Spring', 'Summer', 'Autumn (Fall)', 'Winter'],
      category: 'Nature',
    },
  },
  {
    id: 't1_16',
    tier: 1,
    correctIndex: 1,
    ar: {
      question: 'كم عدد أضلاع الشكل السداسي؟',
      options: ['5 أضلاع', '6 أضلاع', '7 أضلاع', '8 أضلاع'],
      category: 'رياضيات',
    },
    en: {
      question: 'How many sides does a hexagon have?',
      options: ['5 Sides', '6 Sides', '7 Sides', '8 Sides'],
      category: 'Mathematics',
    },
  },
  {
    id: 't1_17',
    tier: 1,
    correctIndex: 0,
    ar: {
      question: 'ما هو الجهاز الذي يُستخدم لقياس درجة الحرارة؟',
      options: ['الترمومتر (المحرار)', 'البارومتر', 'السيزموغراف', 'الميكروسكوب'],
      category: 'علوم',
    },
    en: {
      question: 'Which instrument is used to measure temperature?',
      options: ['Thermometer', 'Barometer', 'Seismograph', 'Microscope'],
      category: 'Science',
    },
  },
  {
    id: 't1_18',
    tier: 1,
    correctIndex: 3,
    ar: {
      question: 'ما هي لغة التواصل الرسمية في البرازيل؟',
      options: ['الإسبانية', 'الفرنسية', 'الإنجليزية', 'البرتغالية'],
      category: 'ثقافة عامة',
    },
    en: {
      question: 'What is the official language of Brazil?',
      options: ['Spanish', 'French', 'English', 'Portuguese'],
      category: 'General Culture',
    },
  },
  {
    id: 't1_19',
    tier: 1,
    correctIndex: 2,
    ar: {
      question: 'ما هو المعدن السائل في درجة حرارة الغرفة؟',
      options: ['الحديد', 'النحاس', 'الزئبق', 'الفضة'],
      category: 'كيمياء',
    },
    en: {
      question: 'Which metal is liquid at standard room temperature?',
      options: ['Iron', 'Copper', 'Mercury', 'Silver'],
      category: 'Chemistry',
    },
  },
  {
    id: 't1_20',
    tier: 1,
    correctIndex: 1,
    ar: {
      question: 'ما هي المدينة العربية الملقبة بـ «الفيحاء»؟',
      options: ['بغداد', 'دمشق', 'بيروت', 'عمّان'],
      category: 'مدن عربية',
    },
    en: {
      question: 'Which historic Arab capital is famously nicknamed "Al-Fayhaa"?',
      options: ['Baghdad', 'Damascus', 'Beirut', 'Amman'],
      category: 'Arab Cities',
    },
  },

  // ============================================
  // TIER 2: MEDIUM (Levels 6 - 10) - 20 Questions
  // ============================================
  {
    id: 't2_01',
    tier: 2,
    correctIndex: 2,
    ar: {
      question: 'من هو العالم الذي اكتشف البنسلين عام 1928؟',
      options: ['لويس باستور', 'روبرت كوخ', 'ألكسندر فليمنغ', 'إدوارد جينر'],
      category: 'تاريخ العلوم',
    },
    en: {
      question: 'Which scientist discovered penicillin in 1928?',
      options: ['Louis Pasteur', 'Robert Koch', 'Alexander Fleming', 'Edward Jenner'],
      category: 'History of Science',
    },
  },
  {
    id: 't2_02',
    tier: 2,
    correctIndex: 0,
    ar: {
      question: 'في أي عام أُقيمت بطولة كأس العالم لكرة القدم في قطر؟',
      options: ['2022', '2018', '2020', '2024'],
      category: 'رياضة',
    },
    en: {
      question: 'In which year was the FIFA World Cup hosted in Qatar?',
      options: ['2022', '2018', '2020', '2024'],
      category: 'Sports',
    },
  },
  {
    id: 't2_03',
    tier: 2,
    correctIndex: 3,
    ar: {
      question: 'ما هو العنصر الكيميائي الذي يحمل الرمز «Au» في الجدول الدوري؟',
      options: ['الفضة', 'الألمنيوم', 'النحاس', 'الذهب'],
      category: 'كيمياء',
    },
    en: {
      question: 'Which chemical element has the symbol "Au" on the periodic table?',
      options: ['Silver', 'Aluminum', 'Copper', 'Gold'],
      category: 'Chemistry',
    },
  },
  {
    id: 't2_04',
    tier: 2,
    correctIndex: 1,
    ar: {
      question: 'من هو مؤلف مسرحية «هاملت» الشهيرة؟',
      options: ['تشارلز ديكنز', 'ويليام شكسبير', 'فيكتور هوغو', 'ليو تولستوي'],
      category: 'أدب عالمي',
    },
    en: {
      question: 'Who wrote the famous tragedy play "Hamlet"?',
      options: ['Charles Dickens', 'William Shakespeare', 'Victor Hugo', 'Leo Tolstoy'],
      category: 'World Literature',
    },
  },
  {
    id: 't2_05',
    tier: 2,
    correctIndex: 2,
    ar: {
      question: 'ما هو المضيق البحري الذي يفصل بين قارة آسيا وقارة أوروبا في تركيا؟',
      options: ['مضيق جبل طارق', 'مضيق هرمز', 'مضيق البوسفور', 'مضيق باب المندب'],
      category: 'جغرافيا',
    },
    en: {
      question: 'Which strait in Turkey separates the Asian and European continents?',
      options: ['Strait of Gibraltar', 'Strait of Hormuz', 'Bosphorus Strait', 'Bab-el-Mandeb'],
      category: 'Geography',
    },
  },
  {
    id: 't2_06',
    tier: 2,
    correctIndex: 0,
    ar: {
      question: 'كم عدد العظام في جسم الإنسان البالغ؟',
      options: ['206 عظمات', '196 عظمة', '216 عظمة', '250 عظمة'],
      category: 'طب وأحياء',
    },
    en: {
      question: 'How many bones are in an adult human body?',
      options: ['206 Bones', '196 Bones', '216 Bones', '250 Bones'],
      category: 'Medicine & Biology',
    },
  },
  {
    id: 't2_07',
    tier: 2,
    correctIndex: 1,
    ar: {
      question: 'من هو الأديب العربي الحائز على جائزة نوبل في الأدب عام 1988؟',
      options: ['طه حسين', 'نجيب محفوظ', 'توفيق الحكيم', 'الطيب صالح'],
      category: 'أدب عربي',
    },
    en: {
      question: 'Which Arab author won the Nobel Prize in Literature in 1988?',
      options: ['Taha Hussein', 'Naguib Mahfouz', 'Tawfiq al-Hakim', 'Tayeb Salih'],
      category: 'Arabic Literature',
    },
  },
  {
    id: 't2_08',
    tier: 2,
    correctIndex: 3,
    ar: {
      question: 'ما هي أطول سلسلة جبال فوق سطح الأرض؟',
      options: ['جبال الهيمالايا', 'جبال الألب', 'جبال روكي', 'جبال الأنديز'],
      category: 'جغرافيا',
    },
    en: {
      question: 'What is the longest continental mountain range in the world?',
      options: ['Himalayas', 'Alps', 'Rocky Mountains', 'Andes'],
      category: 'Geography',
    },
  },
  {
    id: 't2_09',
    tier: 2,
    correctIndex: 0,
    ar: {
      question: 'ما هي الوحدة الدولية لقياس شدة التيار الكهربائي؟',
      options: ['الأمبير', 'الفولت', 'الأوم', 'الواط'],
      category: 'فيزياء',
    },
    en: {
      question: 'What is the SI unit used to measure electric current?',
      options: ['Ampere', 'Volt', 'Ohm', 'Watt'],
      category: 'Physics',
    },
  },
  {
    id: 't2_10',
    tier: 2,
    correctIndex: 2,
    ar: {
      question: 'من هو الرسام العالمي الذي أبدع لوحة «ليلة النجوم» (The Starry Night)؟',
      options: ['بابلو بيكاسو', 'كلود مونيه', 'فينسنت فان غوخ', 'سلفادور دالي'],
      category: 'فنون',
    },
    en: {
      question: 'Which artist painted the masterpiece "The Starry Night"?',
      options: ['Pablo Picasso', 'Claude Monet', 'Vincent van Gogh', 'Salvador Dalí'],
      category: 'Art History',
    },
  },
  {
    id: 't2_11',
    tier: 2,
    correctIndex: 1,
    ar: {
      question: 'ما هي عاصمة كندا؟',
      options: ['تورونتو', 'أوتاوا', 'مونتريال', 'فانكوفر'],
      category: 'جغرافيا',
    },
    en: {
      question: 'What is the capital city of Canada?',
      options: ['Toronto', 'Ottawa', 'Montreal', 'Vancouver'],
      category: 'Geography',
    },
  },
  {
    id: 't2_12',
    tier: 2,
    correctIndex: 3,
    ar: {
      question: 'أي غدة في جسم الإنسان تُعرف باسم «سيدة الغدد الصماء»؟',
      options: ['الغدة الدرقية', 'الغدة الكظرية', 'البنكرياس', 'الغدة النخامية'],
      category: 'طب وأحياء',
    },
    en: {
      question: 'Which gland in the human body is known as the "Master Gland"?',
      options: ['Thyroid Gland', 'Adrenal Gland', 'Pancreas', 'Pituitary Gland'],
      category: 'Medicine & Biology',
    },
  },
  {
    id: 't2_13',
    tier: 2,
    correctIndex: 0,
    ar: {
      question: 'من هو الفنان الإيطالي الذي رسم لوحة «الموناليزا» الشهيرة؟',
      options: ['ليوناردو دا فينشي', 'مايكل أنجلو', 'رافائيل', 'دوناتيلو'],
      category: 'فنون عالمية',
    },
    en: {
      question: 'Which Italian Renaissance artist painted the "Mona Lisa"?',
      options: ['Leonardo da Vinci', 'Michelangelo', 'Raphael', 'Donatello'],
      category: 'World Art',
    },
  },
  {
    id: 't2_14',
    tier: 2,
    correctIndex: 2,
    ar: {
      question: 'ما هو الكوكب الأكثر حرارة في المجموعة الشمسية؟',
      options: ['عطارد', 'المريخ', 'الزهرة', 'زحل'],
      category: 'الفضاء والفلك',
    },
    en: {
      question: 'Which is the hottest planet in our solar system?',
      options: ['Mercury', 'Mars', 'Venus', 'Saturn'],
      category: 'Space & Astronomy',
    },
  },
  {
    id: 't2_15',
    tier: 2,
    correctIndex: 1,
    ar: {
      question: 'في أي عام هبط أول إنسان على سطح القمر في مهمة أبولو 11؟',
      options: ['1965', '1969', '1972', '1961'],
      category: 'تاريخ الفضاء',
    },
    en: {
      question: 'In which year did Apollo 11 land the first humans on the Moon?',
      options: ['1965', '1969', '1972', '1961'],
      category: 'Space History',
    },
  },
  {
    id: 't2_16',
    tier: 2,
    correctIndex: 0,
    ar: {
      question: 'ما هو البحر الذي يفصل بين شبه الجزيرة العربية وقارة أفريقيا؟',
      options: ['البحر الأحمر', 'البحر المتوسط', 'بحر العرب', 'بحر قزوين'],
      category: 'جغرافيا',
    },
    en: {
      question: 'Which sea separates the Arabian Peninsula from Africa?',
      options: ['Red Sea', 'Mediterranean Sea', 'Arabian Sea', 'Caspian Sea'],
      category: 'Geography',
    },
  },
  {
    id: 't2_17',
    tier: 2,
    correctIndex: 3,
    ar: {
      question: 'من هو مخترع المصباح الكهربائي التجاري ومطور الفونوغراف؟',
      options: ['ألكسندر غراهام بيل', 'نيكولا تسلا', 'مايكل فاراداي', 'توماس إديسون'],
      category: 'علوم واختراعات',
    },
    en: {
      question: 'Who is credited with developing the practical incandescent light bulb and the phonograph?',
      options: ['Alexander Graham Bell', 'Nikola Tesla', 'Michael Faraday', 'Thomas Edison'],
      category: 'Inventions',
    },
  },
  {
    id: 't2_18',
    tier: 2,
    correctIndex: 2,
    ar: {
      question: 'كم يبلغ عدد المربعات في رقعة الشطرنج القياسية؟',
      options: ['48 مربعاً', '56 مربعاً', '64 مربعاً', '72 مربعاً'],
      category: 'ألعاب ذهنية',
    },
    en: {
      question: 'How many squares are there on a standard chessboard?',
      options: ['48 Squares', '56 Squares', '64 Squares', '72 Squares'],
      category: 'Mind Games',
    },
  },
  {
    id: 't2_19',
    tier: 2,
    correctIndex: 1,
    ar: {
      question: 'أي فيتامين ينتجه جلد الإنسان عند التعرض لأشعة الشمس؟',
      options: ['فيتامين C', 'فيتامين D', 'فيتامين A', 'فيتامين B12'],
      category: 'صحة وعلوم',
    },
    en: {
      question: 'Which vitamin is synthesized by human skin when exposed to sunlight?',
      options: ['Vitamin C', 'Vitamin D', 'Vitamin A', 'Vitamin B12'],
      category: 'Health & Science',
    },
  },
  {
    id: 't2_20',
    tier: 2,
    correctIndex: 0,
    ar: {
      question: 'ما هي الدولة التي تضم أكبر عدد من البحيرات الطبيعية في العالم؟',
      options: ['كندا', 'روسيا', 'فنلندا', 'الولايات المتحدة'],
      category: 'جغرافيا',
    },
    en: {
      question: 'Which country has the highest number of natural lakes in the world?',
      options: ['Canada', 'Russia', 'Finland', 'United States'],
      category: 'Geography',
    },
  },

  // ===================================================
  // TIER 3: HARD / EXPERT (Levels 11 - 15) - 20 Questions
  // ===================================================
  {
    id: 't3_01',
    tier: 3,
    correctIndex: 2,
    ar: {
      question: 'ما هو العنصر الكيميائي صاحب أعلى درجة انصهار بين جميع المعادن النقية؟',
      options: ['التيتانيوم', 'البلاتين', 'التنغستن (الوولفرام)', 'الأوزميوم'],
      category: 'كيمياء متقدمة',
    },
    en: {
      question: 'Which pure metal has the highest melting point of all chemical elements?',
      options: ['Titanium', 'Platinum', 'Tungsten (Wolfram)', 'Osmium'],
      category: 'Advanced Chemistry',
    },
  },
  {
    id: 't3_02',
    tier: 3,
    correctIndex: 1,
    ar: {
      question: 'في أي عام أُطلق «سبوتنيك 1»، أول قمر صناعي في تاريخ البشرية؟',
      options: ['1953', '1957', '1961', '1965'],
      category: 'تاريخ الفضاء',
    },
    en: {
      question: 'In which year was "Sputnik 1", the first artificial Earth satellite, launched?',
      options: ['1953', '1957', '1961', '1965'],
      category: 'Space History',
    },
  },
  {
    id: 't3_03',
    tier: 3,
    correctIndex: 0,
    ar: {
      question: 'من هما العالمان اللذان توصلا إلى نموذج اللولب المزدوج للحمض النووي (DNA) عام 1953؟',
      options: ['واطسون وكريك', 'باستور وكوخ', 'بور وهايزنبرغ', 'فاراداي وماكسويل'],
      category: 'بيولوجيا جزيئية',
    },
    en: {
      question: 'Which pair of scientists published the double-helix model of DNA structure in 1953?',
      options: ['Watson and Crick', 'Pasteur and Koch', 'Bohr and Heisenberg', 'Faraday and Maxwell'],
      category: 'Molecular Biology',
    },
  },
  {
    id: 't3_04',
    tier: 3,
    correctIndex: 3,
    ar: {
      question: 'ما هي أعمق نقطة معروفة في محيطات الأرض قاطبة؟',
      options: ['خندق بورتوريكو', 'خندق جاوة', 'خندق تونغا', 'تشالنجر ديب (خندق ماريانا)'],
      category: 'علوم الأرض',
    },
    en: {
      question: 'What is the deepest known point in Earth’s oceans?',
      options: ['Puerto Rico Trench', 'Java Trench', 'Tonga Trench', 'Challenger Deep (Mariana Trench)'],
      category: 'Earth Science',
    },
  },
  {
    id: 't3_05',
    tier: 3,
    correctIndex: 1,
    ar: {
      question: 'من هو الشاعر اليوناني القديم الذي يُنسب إليه تأليف ملحمتي «الإلياذة» و«الأوديسة»؟',
      options: ['سوفوكليس', 'هوميروس', 'فيرجيل', 'يوريبيديس'],
      category: 'أدب كلاسيكي',
    },
    en: {
      question: 'Which ancient Greek poet is traditionally credited as the author of the "Iliad" and the "Odyssey"?',
      options: ['Sophocles', 'Homer', 'Virgil', 'Euripides'],
      category: 'Classical Literature',
    },
  },
  {
    id: 't3_06',
    tier: 3,
    correctIndex: 2,
    ar: {
      question: 'حصل ألبرت أينشتاين على جائزة نوبل في الفيزياء عام 1921 عن تفسيره لأي ظاهرة علمية؟',
      options: ['النسبية العامة', 'النسبية الخاصة', 'التأثير الكهروضوئي', 'الحركة البراونية'],
      category: 'فيزياء',
    },
    en: {
      question: 'For which specific discovery was Albert Einstein awarded the 1921 Nobel Prize in Physics?',
      options: ['General Relativity', 'Special Relativity', 'The Photoelectric Effect', 'Brownian Motion'],
      category: 'Physics',
    },
  },
  {
    id: 't3_07',
    tier: 3,
    correctIndex: 0,
    ar: {
      question: 'أي حضارة قديمة بنت مدينة «ماتشو بيتشو» الجبلية في بيرو؟',
      options: ['حضارة الإنكا', 'حضارة المايا', 'حضارة الأزتك', 'حضارة الأولمك'],
      category: 'تاريخ الحضارات',
    },
    en: {
      question: 'Which ancient civilization built the mountain citadel of Machu Picchu in Peru?',
      options: ['The Inca', 'The Maya', 'The Aztec', 'The Olmec'],
      category: 'Ancient Civilizations',
    },
  },
  {
    id: 't3_08',
    tier: 3,
    correctIndex: 3,
    ar: {
      question: 'أي عالم رياضيات وفيلسوف صاغ مبرهنة «عدم الاكتمال» الشهيرة في المنطق الرياضي عام 1931؟',
      options: ['آلان تورينغ', 'ديفيد هيلبرت', 'برتراند راسل', 'كورت غودل'],
      category: 'رياضيات ومنطق',
    },
    en: {
      question: 'Which mathematician published the famous Incompleteness Theorems in mathematical logic in 1931?',
      options: ['Alan Turing', 'David Hilbert', 'Bertrand Russell', 'Kurt Gödel'],
      category: 'Mathematics & Logic',
    },
  },
  {
    id: 't3_09',
    tier: 3,
    correctIndex: 1,
    ar: {
      question: 'ما هي المعاهدة التي أنهت الحرب العالمية الأولى رسمياً عام 1919؟',
      options: ['معاهدة وستفاليا', 'معاهدة فرساي', 'معاهدة لوزان', 'معاهدة فيينا'],
      category: 'تاريخ حديث',
    },
    en: {
      question: 'Which 1919 treaty formally ended World War I between Germany and the Allied Powers?',
      options: ['Treaty of Westphalia', 'Treaty of Versailles', 'Treaty of Lausanne', 'Treaty of Vienna'],
      category: 'Modern History',
    },
  },
  {
    id: 't3_10',
    tier: 3,
    correctIndex: 2,
    ar: {
      question: 'ما هو أثقل عنصر كيميائي يوجد بشكل طبيعي بكميات ملموسة في القشرة الأرضية؟',
      options: ['الرصاص', 'البلوتونيوم', 'اليورانيوم', 'الراديوم'],
      category: 'كيمياء نووية',
    },
    en: {
      question: 'What is the heaviest naturally occurring element found in significant quantities in Earth’s crust?',
      options: ['Lead', 'Plutonium', 'Uranium', 'Radium'],
      category: 'Nuclear Chemistry',
    },
  },
  {
    id: 't3_11',
    tier: 3,
    correctIndex: 0,
    ar: {
      question: 'ما هو أقرب نظام نجمي إلى مجموعتنا الشمسية؟',
      options: ['ألفا قنطورس (Alpha Centauri)', 'الشعرى اليمانية (Sirius)', 'منكب الجوزاء (Betelgeuse)', 'النسر الواقع (Vega)'],
      category: 'فيزياء فلكية',
    },
    en: {
      question: 'What is the closest star system to our Solar System?',
      options: ['Alpha Centauri', 'Sirius', 'Betelgeuse', 'Vega'],
      category: 'Astrophysics',
    },
  },
  {
    id: 't3_12',
    tier: 3,
    correctIndex: 3,
    ar: {
      question: 'أي قمر من أقمار كوكب زحل يمتلك غلافاً جوياً كثيفاً وبحيرات من الميثان السائل؟',
      options: ['أوروبا', 'غانيميد', 'إنسيلادوس', 'تيتان'],
      category: 'الفضاء والفلك',
    },
    en: {
      question: 'Which moon of Saturn possesses a dense atmosphere and stable liquid methane lakes?',
      options: ['Europa', 'Ganymede', 'Enceladus', 'Titan'],
      category: 'Space & Astronomy',
    },
  },
  {
    id: 't3_13',
    tier: 3,
    correctIndex: 1,
    ar: {
      question: 'من هو العالم الذي حاز على جائزة نوبل مرتين في حقلين علميين مختلفين (الفيزياء والكيمياء)؟',
      options: ['لينوس باولنغ', 'ماري كوري', 'جون باردين', 'فريدريك سانجر'],
      category: 'تاريخ العلوم',
    },
    en: {
      question: 'Who is the only person to win Nobel Prizes in two different scientific fields (Physics and Chemistry)?',
      options: ['Linus Pauling', 'Marie Curie', 'John Bardeen', 'Frederick Sanger'],
      category: 'History of Science',
    },
  },
  {
    id: 't3_14',
    tier: 3,
    correctIndex: 2,
    ar: {
      question: 'ما هو الاسم العلمي للطبقة الجوية التي تحتوي على معظم طبقة الأوزون؟',
      options: ['التروبوسفير', 'الميزوسفير', 'الستراتوسفير', 'الثيرموسفير'],
      category: 'علوم الغلاف الجوي',
    },
    en: {
      question: 'Which layer of Earth’s atmosphere contains the majority of the ozone layer?',
      options: ['Troposphere', 'Mesosphere', 'Stratosphere', 'Thermosphere'],
      category: 'Atmospheric Science',
    },
  },
  {
    id: 't3_15',
    tier: 3,
    correctIndex: 0,
    ar: {
      question: 'من هو العالِم البريطاني الذي اخترع الشبكة العنكبوتية العالمية (World Wide Web) عام 1989؟',
      options: ['تيم بيرنرز لي', 'آلان تورينغ', 'تشارلز بابيج', 'فينت سيرف'],
      category: 'علوم الحاسوب',
    },
    en: {
      question: 'Which computer scientist invented the World Wide Web in 1989?',
      options: ['Tim Berners-Lee', 'Alan Turing', 'Charles Babbage', 'Vint Cerf'],
      category: 'Computer Science',
    },
  },
  {
    id: 't3_16',
    tier: 3,
    correctIndex: 3,
    ar: {
      question: 'ما هي الدولة الوحيدة في العالم التي لا يأخذ علمها الوطني شكلاً مستطيلاً أو مربعاً؟',
      options: ['سويسرا', 'الفاتيكان', 'بوتان', 'نيبال'],
      category: 'جغرافيا سياسية',
    },
    en: {
      question: 'Which is the only country in the world whose national flag is neither rectangular nor square?',
      options: ['Switzerland', 'Vatican City', 'Bhutan', 'Nepal'],
      category: 'Political Geography',
    },
  },
  {
    id: 't3_17',
    tier: 3,
    correctIndex: 1,
    ar: {
      question: 'من هو العالم المصري العربي الحائز على جائزة نوبل في الكيمياء عام 1999 عن أبحاث «الفيمتو ثانية»؟',
      options: ['مصطفى السيد', 'أحمد زويل', 'فاروق الباز', 'مجدي يعقوب'],
      category: 'علوم حديثة',
    },
    en: {
      question: 'Which Egyptian-American scientist won the 1999 Nobel Prize in Chemistry for pioneering femtochemistry?',
      options: ['Mostafa El-Sayed', 'Ahmed Zewail', 'Farouk El-Baz', 'Magdi Yacoub'],
      category: 'Modern Science',
    },
  },
  {
    id: 't3_18',
    tier: 3,
    correctIndex: 2,
    ar: {
      question: 'ما هو الجزء المسؤول عن حفظ التوازن وتنسيق الحركات الإرادية في الدماغ البشري؟',
      options: ['المهاد (Thalamus)', 'النخاع المستطيل', 'المخيخ (Cerebellum)', 'الحصين (Hippocampus)'],
      category: 'طب وأعصاب',
    },
    en: {
      question: 'Which structure of the human brain is primarily responsible for motor coordination and balance?',
      options: ['Thalamus', 'Medulla Oblongata', 'Cerebellum', 'Hippocampus'],
      category: 'Neuroscience',
    },
  },
  {
    id: 't3_19',
    tier: 3,
    correctIndex: 0,
    ar: {
      question: 'في أي مدينة إيطالية يقع مدرج «الكولوسيوم» الروماني الشهير؟',
      options: ['روما', 'ميلانو', 'فلورنسا', 'البندقية'],
      category: 'عمارة وتاريخ',
    },
    en: {
      question: 'In which Italian city is the ancient Roman Colosseum located?',
      options: ['Rome', 'Milan', 'Florence', 'Venice'],
      category: 'Architecture & History',
    },
  },
  {
    id: 't3_20',
    tier: 3,
    correctIndex: 3,
    ar: {
      question: 'كم تبلغ سرعة الضوء في الفراغ تقريباً بالكيلومتر في الثانية؟',
      options: ['150,000 كم/ث', '200,000 كم/ث', '250,000 كم/ث', '300,000 كم/ث'],
      category: 'فيزياء فلكية',
    },
    en: {
      question: 'What is the approximate speed of light in a vacuum in kilometers per second?',
      options: ['150,000 km/s', '200,000 km/s', '250,000 km/s', '300,000 km/s'],
      category: 'Astrophysics',
    },
  },
];
