import {
  RestaurantSettings,
  MenuCategory,
  MenuItem,
  GalleryImage,
  Review,
  ContactMessage,
  CartItem,
  Order,
  OrderItem,
  OrderStatus,
  OrderType,
  PaymentMethod,
  Customer,
  RestaurantTable,
  Offer,
  Coupon,
} from '../types';

// Asset paths
export const IMAGES = {
  hero: '/src/assets/images/hero_egyptian_falafel_feast_1791197721213.jpg',
  taameya: '/src/assets/images/food_taameya_crunch_1791197737382.jpg',
  foul: '/src/assets/images/food_foul_mudammas_1791197748485.jpg',
  sandwiches: '/src/assets/images/food_falafel_sandwiches_1791203776778.jpg',
  meals: '/src/assets/images/food_popular_meal_platter_1791203793987.jpg',
  sides: '/src/assets/images/food_sides_and_pickles_1791203806206.jpg',
  interior: '/src/assets/images/restaurant_ambiance_warm_1791197758646.jpg',
};

const STORAGE_KEYS = {
  SETTINGS: 'alza3eem_settings_v3',
  CATEGORIES: 'alza3eem_categories_v3',
  MENU_ITEMS: 'alza3eem_menu_items_v3',
  GALLERY: 'alza3eem_gallery_v3',
  REVIEWS: 'alza3eem_reviews_v3',
  MESSAGES: 'alza3eem_messages_v3',
  ADMIN_AUTH: 'alza3eem_admin_auth_v3',
  CART: 'alza3eem_cart_v3',
  ORDERS: 'alza3eem_orders_v3',
  CUSTOMERS: 'alza3eem_customers_v3',
  TABLES: 'alza3eem_tables_v3',
  OFFERS: 'alza3eem_offers_v3',
  COUPONS: 'alza3eem_coupons_v3',
  THEME: 'alza3eem_theme_v3',
};

// Initial Seeds
const DEFAULT_SETTINGS: RestaurantSettings = {
  id: 'alza3eem_main',
  name: 'مطعم الزعيم',
  tagline: 'أصالة الطعم المصري... الفول والفلافل على أصولها في الحسينية',
  shortDescription:
    'مطعم الزعيم في الحسينية، متخصص في الفلافل والطعمية المقرمشة، الفول المدمس البلدي، الساندوتشات والوجبات الشعبية المصرية بأعلى جودة ونظافة على مدار 24 ساعة.',
  aboutStory:
    'تأسس مطعم الزعيم في قلب مركز الحسينية بمحافظة الشرقية ليكون الوجهة الأولى لعشاق الفول المدمس والفلافل المقرمشة والمأكولات الشعبية المصرية الأصيلة. نلتزم يومياً باختيار أجود أنواع الفول البلدي، وتحضير الطعمية بالخضرة الطازجة والسمسم البلدي، والقلي في زيوت نقية متجددة مع أعلى معايير النظافة، لتقديم أشهى الساندوتشات والوجبات الشعبية طوال 24 ساعة دون توقف.',
  category: 'مطعم فلافل / طعمية ومأكولات شعبية مصرية',
  phone: '01204241578',
  whatsappNumber: '201204241578',
  address: 'المركز، الحسينية، مركز الحسينية، محافظة الشرقية، مصر',
  locality: 'الحسينية',
  governorate: 'الشرقية',
  priceRange: '1–200 جنيه للفرد',
  rating: 4.1,
  reviewsCount: 107,
  openingHours: 'مفتوح على مدار الساعة (24/7)',
  googleMapsUrl: 'https://maps.google.com/?q=المركز+الحسينية+مركز+الحسينية+الشرقية+مصر',
  googleReviewUrl: '',
  heroImage: IMAGES.hero,
  deliveryFee: 15,
  facebookUrl: '',
  instagramUrl: '',
  tiktokUrl: '',
};

const DEFAULT_CATEGORIES: MenuCategory[] = [
  { id: 'all', name: 'الكل', slug: 'all', sortOrder: 0 },
  { id: 'falafel', name: 'الفلافل والطعمية', slug: 'falafel', sortOrder: 1 },
  { id: 'sandwiches', name: 'الساندوتشات', slug: 'sandwiches', sortOrder: 2 },
  { id: 'meals', name: 'الوجبات', slug: 'meals', sortOrder: 3 },
  { id: 'popular_dishes', name: 'الأطباق الشعبية', slug: 'popular_dishes', sortOrder: 4 },
  { id: 'sides', name: 'الإضافات والمقبلات', slug: 'sides', sortOrder: 5 },
  { id: 'beverages', name: 'المشروبات', slug: 'beverages', sortOrder: 6 },
];

const DEFAULT_MENU_ITEMS: MenuItem[] = [
  // 1. الفلافل والطعمية
  {
    id: 'm1',
    name: 'قرص طعمية مخصوص بالسمسم والكزبرة',
    description: 'قرص طعمية ساخن ومقرمش غني بالخضار والكرات البلدي مغطى بالسمسم الأبيض والكزبرة المحمصة، مقلي في زيت نقي.',
    categoryId: 'falafel',
    price: 3,
    image: IMAGES.taameya,
    isAvailable: true,
    isFeatured: true,
    badge: 'الأكثر طلباً',
    sortOrder: 1,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
  {
    id: 'm2',
    name: 'طعمية محشية بالخلطة الحارة والمتبلة',
    description: 'قرص طعمية كبير محشو بخلطة البصل المحمر، الفلفل الحار، الشطة، وصلصة الطماطم المسبكة مع بهارات الزعيم السرية.',
    categoryId: 'falafel',
    price: 5,
    image: IMAGES.taameya,
    isAvailable: true,
    isFeatured: true,
    badge: 'توقيع الزعيم',
    sortOrder: 2,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
  {
    id: 'm3',
    name: 'طعمية كيري وموتزاريلا سايحة',
    description: 'قرص طعمية مقرمش ومحشو بقلب غني من الجبن الكيري الكريمي أو الموتزاريلا الذائبة لمذاق عصري مميز.',
    categoryId: 'falafel',
    price: 8,
    image: IMAGES.taameya,
    isAvailable: true,
    isFeatured: false,
    badge: 'مميز',
    sortOrder: 3,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
  {
    id: 'm4',
    name: 'علبة عجينة طعمية خام متبلة للبيت',
    description: 'عجينة طعمية طازجة متبلة بالثوم والكرات والتوابل الخضراء الصافية، جاهزة للقلي المباشر بالمنزل.',
    categoryId: 'falafel',
    price: 20,
    image: IMAGES.taameya,
    isAvailable: true,
    isFeatured: false,
    badge: '',
    sortOrder: 4,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },

  // 2. الساندوتشات
  {
    id: 'm5',
    name: 'ساندوتش طعمية بالسمسم والسلطة والطحينة',
    description: 'عيش بلدي مصري ساخن محشو أقراص طعمية مقرمشة مع سلطة خضراء طازجة، طحينة بيضاء وشرائح باذنجان مقلي.',
    categoryId: 'sandwiches',
    price: 6,
    image: IMAGES.sandwiches,
    isAvailable: true,
    isFeatured: true,
    badge: 'الأكثر مبيعاً',
    sortOrder: 5,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
  {
    id: 'm6',
    name: 'ساندوتش فول بلدي بالزيت الحار والليمون',
    description: 'فول مدمس زبدة بالزيت الحار الفاخر، كمون، ليمون، وسلطة طحينة داخل رغيف بلدي فلاحي.',
    categoryId: 'sandwiches',
    price: 6,
    image: IMAGES.sandwiches,
    isAvailable: true,
    isFeatured: true,
    badge: 'كلاسيك مصري',
    sortOrder: 6,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
  {
    id: 'm7',
    name: 'ساندوتش فول بالسمنة البلدي الفلاحي',
    description: 'فول مدمس مطحون ناعم ومسقى بملعقة سمنة بلدي بقري فلاحي على أصولها برائحة تفتح النفس.',
    categoryId: 'sandwiches',
    price: 8,
    image: IMAGES.sandwiches,
    isAvailable: true,
    isFeatured: false,
    badge: '',
    sortOrder: 7,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
  {
    id: 'm8',
    name: 'ساندوتش ديناميت الزعيم الجبار',
    description: 'مكس الزعيم الأسطوري: فول مدمس، طعمية مقرمشة، بيض مسلوق، بطاطس مقلية، بتنجان مخلل ودقة وطحينة.',
    categoryId: 'sandwiches',
    price: 15,
    image: IMAGES.sandwiches,
    isAvailable: true,
    isFeatured: true,
    badge: 'توقيع الزعيم',
    sortOrder: 8,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
  {
    id: 'm9',
    name: 'ساندوتش بطاطس بانيه مقرمشة بالطحينة',
    description: 'أصابع بطاطس مقلية ذهبية ومقرمشة مع رشة بهارات خاصة وطحينة بيضاء داخل عيش بلدي طازج.',
    categoryId: 'sandwiches',
    price: 8,
    image: IMAGES.sandwiches,
    isAvailable: true,
    isFeatured: false,
    badge: '',
    sortOrder: 9,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
  {
    id: 'm10',
    name: 'ساندوتش بيض مسلوق ومقلي بالسمنة البلدي',
    description: 'بيض بلدي طازج محمر في سمنة بلدي مع رشة فلفل أسود وكمون داخل عيش بلدي ساخن.',
    categoryId: 'sandwiches',
    price: 12,
    image: IMAGES.sandwiches,
    isAvailable: true,
    isFeatured: false,
    badge: '',
    sortOrder: 10,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },

  // 3. الوجبات
  {
    id: 'm11',
    name: 'وجبة فطور الزعيم المشكلة لشخصين',
    description: 'طبق فول مدمس بالزيت والليمون، 6 أقراص طعمية بالسمسم، طبق بطاطس محمرة، باذنجان بالدقة، طحينة، مخلل، و5 أرغفة عيش بلدي ساخن.',
    categoryId: 'meals',
    price: 45,
    image: IMAGES.meals,
    isAvailable: true,
    isFeatured: true,
    badge: 'الأكثر طلباً',
    sortOrder: 11,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
  {
    id: 'm12',
    name: 'وجبة اللمة العائلية الملوكي',
    description: 'علبتين فول مدمس متنوع، 12 قرص طعمية بالسمسم والمحشية، باكت بطاطس عائلي، مسقعة بلدي، بتنجان بالدقة، سلطة وطحينة، و12 رغيف عيش.',
    categoryId: 'meals',
    price: 90,
    image: IMAGES.meals,
    isAvailable: true,
    isFeatured: false,
    badge: 'توفير عائلي',
    sortOrder: 12,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
  {
    id: 'm13',
    name: 'وجبة التوفير السريعة الفردية',
    description: 'ساندوتش فول بلدي + ساندوتش طعمية مخصوص + باكت بطاطس صغير + كانز مثلج.',
    categoryId: 'meals',
    price: 32,
    image: IMAGES.meals,
    isAvailable: true,
    isFeatured: false,
    badge: '',
    sortOrder: 13,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },

  // 4. الأطباق الشعبية
  {
    id: 'm14',
    name: 'طبق فول مدمس بلدي بالزيت والكمون والليمون',
    description: 'فول بلدي مصري مدمس بطيء بقوام كريمي زبدة مع سر بهارات ودقة الزعيم وزيت نقي وليمون طازج.',
    categoryId: 'popular_dishes',
    price: 15,
    image: IMAGES.foul,
    isAvailable: true,
    isFeatured: true,
    badge: 'أساسي المائدة',
    sortOrder: 14,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
  {
    id: 'm15',
    name: 'طبق فول إسكندراني بالصلصة المسبكة والفلفل',
    description: 'فول مدمس مطبوخ مع صلصة طماطم مسبكة، ثوم، فلفل أخضر حار، بصل وتوابل إسكندرانية غنية.',
    categoryId: 'popular_dishes',
    price: 18,
    image: IMAGES.foul,
    isAvailable: true,
    isFeatured: false,
    badge: '',
    sortOrder: 15,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
  {
    id: 'm16',
    name: 'طبق شكشوكة مصرية بالبيض والطماطم',
    description: 'بيض بلدي مطبوخ في صلصة طماطم مسبكة بالبصل والفلفل الرومي والتوابل الفلاحي الشهية.',
    categoryId: 'popular_dishes',
    price: 25,
    image: IMAGES.foul,
    isAvailable: true,
    isFeatured: false,
    badge: '',
    sortOrder: 16,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
  {
    id: 'm17',
    name: 'طبق مسقعة بلدي بالخل والثوم',
    description: 'باذنجان وبطاطس وفلفل مقليين في صلصة طماطم فلاحي بالثوم والخل والكمون البلدي.',
    categoryId: 'popular_dishes',
    price: 20,
    image: IMAGES.sides,
    isAvailable: true,
    isFeatured: false,
    badge: '',
    sortOrder: 17,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },

  // 5. الإضافات والمقبلات
  {
    id: 'm18',
    name: 'طبق باذنجان مخلل بالدقة والثوم والليمون',
    description: 'باذنجان بلدي متبل بخلطة الثوم والفلفل الأحمر والكمون والخل والليمون الفريش.',
    categoryId: 'sides',
    price: 10,
    image: IMAGES.sides,
    isAvailable: true,
    isFeatured: false,
    badge: '',
    sortOrder: 18,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
  {
    id: 'm19',
    name: 'طبق طرشي ومخلل بلدي مشكل معتمد',
    description: 'تشكيلة مخلل مصري بلدي مقرمش باللفت، الجزر، الخيار، والفلفل الحار المعتدل.',
    categoryId: 'sides',
    price: 7,
    image: IMAGES.sides,
    isAvailable: true,
    isFeatured: false,
    badge: '',
    sortOrder: 19,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
  {
    id: 'm20',
    name: 'طبق طحينة سمسم بيضاء ناعمة متبلة',
    description: 'طحينة سمسم بيضاء نقية متبلة بالليمون، الخل، رشة كمون وزيت نقي.',
    categoryId: 'sides',
    price: 10,
    image: IMAGES.sides,
    isAvailable: true,
    isFeatured: false,
    badge: '',
    sortOrder: 20,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
  {
    id: 'm21',
    name: 'باكت بطاطس صوابع مقلية ومملحة',
    description: 'أصابع بطاطس فريش مقلية ومقرمشة ومتبلة ببهار البطاطس اللذيذ.',
    categoryId: 'sides',
    price: 15,
    image: IMAGES.sides,
    isAvailable: true,
    isFeatured: false,
    badge: '',
    sortOrder: 21,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },

  // 6. المشروبات
  {
    id: 'm22',
    name: 'شاي مصري كشري بالنعناع البلدي الفريش',
    description: 'شاي أحمر مصري ثقيل ومظبوط مع أوراق النعناع البلدي الطازج المنعش.',
    categoryId: 'beverages',
    price: 10,
    image: IMAGES.interior,
    isAvailable: true,
    isFeatured: false,
    badge: '',
    sortOrder: 22,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
  {
    id: 'm23',
    name: 'كانز مياه غازية متنوعة مثلجة',
    description: 'بيبسي، كوكاكولا، سفن آب، سبرايت، أو فانتا مثلجة ومنعشة.',
    categoryId: 'beverages',
    price: 15,
    image: IMAGES.interior,
    isAvailable: true,
    isFeatured: false,
    badge: '',
    sortOrder: 23,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
  {
    id: 'm24',
    name: 'زجاجة مياه معدنية نقية مثلجة',
    description: 'مياه شرب طبيعية نقية ومبردة 600 مل.',
    categoryId: 'beverages',
    price: 7,
    image: IMAGES.interior,
    isAvailable: true,
    isFeatured: false,
    badge: '',
    sortOrder: 24,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  },
];

const DEFAULT_TABLES: RestaurantTable[] = [
  { id: 'tbl_1', tableNumber: 1, title: 'ترابيزة 1', capacity: 4, isActive: true, createdAt: '2026-01-01' },
  { id: 'tbl_2', tableNumber: 2, title: 'ترابيزة 2', capacity: 4, isActive: true, createdAt: '2026-01-01' },
  { id: 'tbl_3', tableNumber: 3, title: 'ترابيزة 3', capacity: 2, isActive: true, createdAt: '2026-01-01' },
  { id: 'tbl_4', tableNumber: 4, title: 'ترابيزة 4 (عائلية)', capacity: 6, isActive: true, createdAt: '2026-01-01' },
  { id: 'tbl_5', tableNumber: 5, title: 'ترابيزة 5', capacity: 4, isActive: true, createdAt: '2026-01-01' },
  { id: 'tbl_6', tableNumber: 6, title: 'ترابيزة 6', capacity: 4, isActive: true, createdAt: '2026-01-01' },
];

const DEFAULT_COUPONS: Coupon[] = [
  {
    id: 'c1',
    code: 'ZAEEM10',
    discountType: 'percentage',
    discountValue: 10,
    minimumOrder: 40,
    maximumDiscount: 20,
    startDate: '2026-01-01',
    endDate: '2027-12-31',
    usedCount: 0,
    active: true,
  },
  {
    id: 'c2',
    code: 'BARAKA',
    discountType: 'fixed',
    discountValue: 5,
    minimumOrder: 25,
    startDate: '2026-01-01',
    endDate: '2027-12-31',
    usedCount: 0,
    active: true,
  },
];

const DEFAULT_GALLERY: GalleryImage[] = [
  {
    id: 'g1',
    title: 'وليمة الفطور المصري الشعبي بمطعم الزعيم',
    category: 'food',
    imageUrl: IMAGES.hero,
    isFeatured: true,
    sortOrder: 1,
    createdAt: '2026-01-01',
  },
  {
    id: 'g2',
    title: 'أقراص الطعمية الساخنة المقرمشة بالسمسم والكزبرة',
    category: 'food',
    imageUrl: IMAGES.taameya,
    isFeatured: true,
    sortOrder: 2,
    createdAt: '2026-01-02',
  },
  {
    id: 'g3',
    title: 'طبق الفول المدمس البلدي بزيت الزيتون والكمون',
    category: 'food',
    imageUrl: IMAGES.foul,
    isFeatured: true,
    sortOrder: 3,
    createdAt: '2026-01-03',
  },
  {
    id: 'g4',
    title: 'تشكيلة ساندوتشات الفول والطعمية والبطاطس بالعيش البلدي',
    category: 'food',
    imageUrl: IMAGES.sandwiches,
    isFeatured: true,
    sortOrder: 4,
    createdAt: '2026-01-04',
  },
  {
    id: 'g5',
    title: 'صينية الوجبة الشعبية المتكاملة مع الباذنجان والمخلل',
    category: 'food',
    imageUrl: IMAGES.meals,
    isFeatured: true,
    sortOrder: 5,
    createdAt: '2026-01-05',
  },
  {
    id: 'g6',
    title: 'صالة المطعم والأجواء الترحيبية بالحسينية',
    category: 'restaurant',
    imageUrl: IMAGES.interior,
    isFeatured: false,
    sortOrder: 6,
    createdAt: '2026-01-06',
  },
];

// Exact Real Seed Reviews for Falafel & Popular Egyptian Cuisine
const DEFAULT_REVIEWS: Review[] = [
  {
    id: 'rev1',
    authorName: 'Kariman',
    rating: 5,
    date: 'منذ أسبوعين',
    content: 'روعة الروعة من افضل مطاعم الماكولات الشعبيه المصريه، طعمية مقرمشة وسخنة وفول بلدي مظبوط جداً.',
    status: 'approved',
    isVerified: true,
  },
  {
    id: 'rev2',
    authorName: 'Ola Fouad',
    rating: 5,
    date: 'منذ شهر',
    content: 'مكان محترم واكل نضيف، الساندوتشات معمولة بإتقان وسرعة في التجهيز.',
    status: 'approved',
    isVerified: true,
  },
  {
    id: 'rev3',
    authorName: 'Mohamed Eltahawy',
    rating: 5,
    date: 'منذ 3 أشهر',
    content: 'مطعم الزعيم افضل مطعم في الحسينيه ونتمنى أن يكون لهم فرع في سعود.',
    status: 'approved',
    isVerified: true,
  },
];

const DEFAULT_MESSAGES: ContactMessage[] = [
  {
    id: 'msg1',
    name: 'أحمد إبراهيم',
    phone: '01012345678',
    message: 'السلام عليكم، هل متاح تجهيز وجبات فطور مشكلة (فول وطعمية وسلطات) لورشة عمل بالحسينية غداً صباحاً؟',
    isRead: false,
    createdAt: '2026-10-04T18:30:00Z',
  },
  {
    id: 'msg2',
    name: 'سارة محمود',
    phone: '01123456789',
    message: 'ما شاء الله أكلكم ممتاز ونظيف جداً، هل التوصيل متوفر لجميع أنحاء مركز الحسينية؟',
    isRead: true,
    createdAt: '2026-10-03T12:15:00Z',
  },
];

// Listeners for multi-component reactivity
type DataChangeListener = () => void;
const listeners: Set<DataChangeListener> = new Set();

function notifyChange() {
  listeners.forEach((listener) => {
    try {
      listener();
    } catch {
      // Ignore listener error
    }
  });
}

// Database Service with LocalStorage persistence
export const db = {
  subscribe(listener: DataChangeListener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  // THEME (Dark / Light)
  getTheme(): 'dark' | 'light' {
    const saved = localStorage.getItem(STORAGE_KEYS.THEME);
    if (saved === 'light' || saved === 'dark') return saved;
    return 'dark'; // Default premium restaurant dark palette
  },

  setTheme(theme: 'dark' | 'light'): void {
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }
    notifyChange();
  },

  // RESTAURANT SETTINGS
  getSettings(): RestaurantSettings {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
      return DEFAULT_SETTINGS;
    }
    try {
      return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
    } catch {
      return DEFAULT_SETTINGS;
    }
  },

  updateSettings(settings: Partial<RestaurantSettings>): RestaurantSettings {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    notifyChange();
    return updated;
  },

  // CATEGORIES
  getCategories(): MenuCategory[] {
    const data = localStorage.getItem(STORAGE_KEYS.CATEGORIES);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
      return DEFAULT_CATEGORIES;
    }
    try {
      return JSON.parse(data);
    } catch {
      return DEFAULT_CATEGORIES;
    }
  },

  addCategory(category: Omit<MenuCategory, 'id'>): MenuCategory {
    const categories = this.getCategories();
    const newCat: MenuCategory = {
      ...category,
      id: 'cat_' + Date.now(),
    };
    categories.push(newCat);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    notifyChange();
    return newCat;
  },

  updateCategory(id: string, updates: Partial<MenuCategory>): MenuCategory | null {
    const categories = this.getCategories();
    const index = categories.findIndex((c) => c.id === id);
    if (index === -1) return null;
    categories[index] = { ...categories[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    notifyChange();
    return categories[index];
  },

  deleteCategory(id: string): boolean {
    const categories = this.getCategories().filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    notifyChange();
    return true;
  },

  saveCategory(cat: { id?: string; name: string; slug: string; sortOrder: number }): MenuCategory {
    if (cat.id) {
      this.updateCategory(cat.id, cat);
      return cat as MenuCategory;
    }
    return this.addCategory(cat);
  },

  // MENU ITEMS
  getMenuItems(): MenuItem[] {
    const data = localStorage.getItem(STORAGE_KEYS.MENU_ITEMS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(DEFAULT_MENU_ITEMS));
      return DEFAULT_MENU_ITEMS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return DEFAULT_MENU_ITEMS;
    }
  },

  getFeaturedItems(): MenuItem[] {
    return this.getMenuItems().filter((item) => item.isFeatured && item.isAvailable);
  },

  addMenuItem(item: Omit<MenuItem, 'id' | 'createdAt' | 'updatedAt'>): MenuItem {
    const items = this.getMenuItems();
    const now = new Date().toISOString();
    const newItem: MenuItem = {
      ...item,
      id: 'item_' + Date.now(),
      createdAt: now,
      updatedAt: now,
    };
    items.unshift(newItem);
    localStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(items));
    notifyChange();
    return newItem;
  },

  updateMenuItem(id: string, updates: Partial<MenuItem>): MenuItem | null {
    const items = this.getMenuItems();
    const index = items.findIndex((i) => i.id === id);
    if (index === -1) return null;
    items[index] = {
      ...items[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    localStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(items));
    notifyChange();
    return items[index];
  },

  deleteMenuItem(id: string): boolean {
    const items = this.getMenuItems().filter((i) => i.id !== id);
    localStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(items));
    notifyChange();
    return true;
  },

  toggleItemAvailability(id: string): MenuItem | null {
    const items = this.getMenuItems();
    const item = items.find((i) => i.id === id);
    if (!item) return null;
    item.isAvailable = !item.isAvailable;
    item.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(items));
    notifyChange();
    return item;
  },

  toggleItemFeatured(id: string): MenuItem | null {
    const items = this.getMenuItems();
    const item = items.find((i) => i.id === id);
    if (!item) return null;
    item.isFeatured = !item.isFeatured;
    item.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(items));
    notifyChange();
    return item;
  },

  saveMenuItem(item: {
    id?: string;
    name: string;
    description: string;
    categoryId: string;
    price: number;
    image: string;
    badge?: string;
    isAvailable: boolean;
    isFeatured: boolean;
    sortOrder: number;
  }): MenuItem {
    if (item.id) {
      const updated = this.updateMenuItem(item.id, item);
      if (updated) return updated;
    }
    return this.addMenuItem(item);
  },

  // CART (Visitor's localStorage cart)
  getCart(): CartItem[] {
    const data = localStorage.getItem(STORAGE_KEYS.CART);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  addToCart(item: { productId: string; name: string; price: number; image: string; quantity?: number; notes?: string }): CartItem[] {
    const cart = this.getCart();
    const qty = item.quantity && item.quantity > 0 ? item.quantity : 1;
    const existingIndex = cart.findIndex((i) => i.productId === item.productId);

    if (existingIndex > -1) {
      cart[existingIndex].quantity += qty;
      if (item.notes) cart[existingIndex].notes = item.notes;
    } else {
      cart.push({
        productId: item.productId,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: qty,
        notes: item.notes,
      });
    }

    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    notifyChange();
    return cart;
  },

  updateCartQuantity(productId: string, quantity: number): CartItem[] {
    let cart = this.getCart();
    if (quantity <= 0) {
      cart = cart.filter((i) => i.productId !== productId);
    } else {
      const index = cart.findIndex((i) => i.productId === productId);
      if (index > -1) {
        cart[index].quantity = quantity;
      }
    }
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    notifyChange();
    return cart;
  },

  updateCartItemNotes(productId: string, notes: string): CartItem[] {
    const cart = this.getCart();
    const index = cart.findIndex((i) => i.productId === productId);
    if (index > -1) {
      cart[index].notes = notes;
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
      notifyChange();
    }
    return cart;
  },

  removeFromCart(productId: string): CartItem[] {
    const cart = this.getCart().filter((i) => i.productId !== productId);
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    notifyChange();
    return cart;
  },

  clearCart(): void {
    localStorage.removeItem(STORAGE_KEYS.CART);
    notifyChange();
  },

  // ORDERS MANAGEMENT
  getOrders(): Order[] {
    const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  getOrderById(id: string): Order | undefined {
    return this.getOrders().find((o) => o.id === id);
  },

  getOrderByNumber(orderNumber: string): Order | undefined {
    const clean = orderNumber.trim().toUpperCase();
    return this.getOrders().find((o) => o.orderNumber.toUpperCase() === clean);
  },

  trackOrder(orderNumber: string, phone: string): Order | undefined {
    const cleanNum = orderNumber.trim().toUpperCase();
    const cleanPhone = phone.trim().replace(/\D/g, '');
    return this.getOrders().find((o) => {
      const oNum = o.orderNumber.toUpperCase();
      const oPhone = o.phone.replace(/\D/g, '');
      return oNum === cleanNum && oPhone.includes(cleanPhone);
    });
  },

  createOrder(payload: {
    customerName: string;
    phone: string;
    address: string;
    area?: string;
    streetBuilding?: string;
    orderType: OrderType;
    tableNumber?: string | number;
    paymentMethod: PaymentMethod;
    notes?: string;
    couponCode?: string;
  }): { success: boolean; order?: Order; error?: string } {
    const cart = this.getCart();
    if (cart.length === 0) {
      return { success: false, error: 'سلة المشتريات فارغة' };
    }

    // DATA INTEGRITY: Validate items and prices directly against real database
    const allMenuItems = this.getMenuItems();
    const orderItems: OrderItem[] = [];
    let subtotal = 0;

    for (const item of cart) {
      const menuItem = allMenuItems.find((m) => m.id === item.productId);
      if (!menuItem) {
        return { success: false, error: `المنتج "${item.name}" لم يعد موجوداً في القائمة` };
      }
      if (!menuItem.isAvailable) {
        return { success: false, error: `المنتج "${menuItem.name}" غير متوفر حالياً` };
      }
      const itemSubtotal = menuItem.price * item.quantity;
      subtotal += itemSubtotal;
      orderItems.push({
        productId: menuItem.id,
        productName: menuItem.name,
        quantity: item.quantity,
        unitPrice: menuItem.price,
        subtotal: itemSubtotal,
        notes: item.notes,
      });
    }

    // Coupon discount calculation
    let discount = 0;
    if (payload.couponCode) {
      const couponValidation = this.validateCoupon(payload.couponCode, subtotal);
      if (couponValidation.valid) {
        discount = couponValidation.discount;
      }
    }

    // Delivery fee
    const settings = this.getSettings();
    const deliveryFee = payload.orderType === 'delivery' ? (settings.deliveryFee ?? 15) : 0;
    const total = Math.max(0, subtotal - discount + deliveryFee);

    const orders = this.getOrders();
    const nextNum = 1000 + orders.length + 1;
    const orderNumber = `ZAEEM-${nextNum}`;
    const now = new Date().toISOString();

    const newOrder: Order = {
      id: 'ord_' + Date.now(),
      orderNumber,
      customerName: payload.customerName.trim(),
      phone: payload.phone.trim(),
      address: payload.address.trim(),
      area: payload.area?.trim(),
      streetBuilding: payload.streetBuilding?.trim(),
      orderType: payload.orderType,
      tableNumber: payload.tableNumber,
      paymentMethod: payload.paymentMethod,
      subtotal,
      discount,
      deliveryFee,
      total,
      status: 'new',
      notes: payload.notes?.trim(),
      items: orderItems,
      couponCode: payload.couponCode?.trim(),
      createdAt: now,
      updatedAt: now,
    };

    orders.unshift(newOrder);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));

    // Update Customer record automatically
    this.recordCustomerOrder(newOrder);

    // If coupon used, increment its used count
    if (payload.couponCode) {
      this.incrementCouponUsage(payload.couponCode);
    }

    // Clear cart on success
    this.clearCart();
    notifyChange();

    return { success: true, order: newOrder };
  },

  updateOrderStatus(orderId: string, status: OrderStatus): boolean {
    const orders = this.getOrders();
    const order = orders.find((o) => o.id === orderId);
    if (!order) return false;
    order.status = status;
    order.updatedAt = new Date().toISOString();
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    notifyChange();
    return true;
  },

  reorder(order: Order): { addedCount: number; unavailableItems: string[] } {
    const allMenuItems = this.getMenuItems();
    let addedCount = 0;
    const unavailableItems: string[] = [];

    for (const item of order.items) {
      const menuItem = allMenuItems.find((m) => m.id === item.productId);
      if (menuItem && menuItem.isAvailable) {
        this.addToCart({
          productId: menuItem.id,
          name: menuItem.name,
          price: menuItem.price,
          image: menuItem.image,
          quantity: item.quantity,
          notes: item.notes,
        });
        addedCount++;
      } else {
        unavailableItems.push(item.productName);
      }
    }

    return { addedCount, unavailableItems };
  },

  // CUSTOMERS DATABASE
  getCustomers(): Customer[] {
    const data = localStorage.getItem(STORAGE_KEYS.CUSTOMERS);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  getCustomerById(id: string): Customer | undefined {
    return this.getCustomers().find((c) => c.id === id);
  },

  recordCustomerOrder(order: Order): void {
    const customers = this.getCustomers();
    const cleanPhone = order.phone.trim();
    let customer = customers.find((c) => c.phone.trim() === cleanPhone);

    const now = new Date().toISOString();
    if (customer) {
      customer.ordersCount += 1;
      customer.totalSpent += order.total;
      customer.lastOrder = now;
      if (order.customerName && order.customerName !== customer.name) {
        customer.name = order.customerName;
      }
      if (order.address && !customer.addresses.some((a) => a.street === order.address)) {
        customer.addresses.push({
          id: 'addr_' + Date.now(),
          area: order.area || '',
          street: order.address,
          building: order.streetBuilding,
        });
      }
    } else {
      customer = {
        id: 'cust_' + Date.now(),
        name: order.customerName,
        phone: cleanPhone,
        ordersCount: 1,
        totalSpent: order.total,
        lastOrder: now,
        createdAt: now,
        addresses: order.address
          ? [
              {
                id: 'addr_' + Date.now(),
                area: order.area || '',
                street: order.address,
                building: order.streetBuilding,
              },
            ]
          : [],
      };
      customers.push(customer);
    }

    localStorage.setItem(STORAGE_KEYS.CUSTOMERS, JSON.stringify(customers));
  },

  // TABLES MANAGEMENT (Table QR)
  getTables(): RestaurantTable[] {
    const data = localStorage.getItem(STORAGE_KEYS.TABLES);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(DEFAULT_TABLES));
      return DEFAULT_TABLES;
    }
    try {
      return JSON.parse(data);
    } catch {
      return DEFAULT_TABLES;
    }
  },

  addTable(table: { tableNumber: string | number; title: string; capacity?: number }): RestaurantTable {
    const tables = this.getTables();
    const newTable: RestaurantTable = {
      ...table,
      id: 'tbl_' + Date.now(),
      isActive: true,
      createdAt: new Date().toISOString(),
    };
    tables.push(newTable);
    localStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(tables));
    notifyChange();
    return newTable;
  },

  updateTable(id: string, updates: Partial<RestaurantTable>): RestaurantTable | null {
    const tables = this.getTables();
    const index = tables.findIndex((t) => t.id === id);
    if (index === -1) return null;
    tables[index] = { ...tables[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(tables));
    notifyChange();
    return tables[index];
  },

  deleteTable(id: string): boolean {
    const tables = this.getTables().filter((t) => t.id !== id);
    localStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(tables));
    notifyChange();
    return true;
  },

  // OFFERS MANAGEMENT (Admin only)
  getOffers(): Offer[] {
    const data = localStorage.getItem(STORAGE_KEYS.OFFERS);
    if (!data) return [];
    try {
      return JSON.parse(data);
    } catch {
      return [];
    }
  },

  addOffer(offer: Omit<Offer, 'id' | 'createdAt'>): Offer {
    const offers = this.getOffers();
    const newOffer: Offer = {
      ...offer,
      id: 'off_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    offers.unshift(newOffer);
    localStorage.setItem(STORAGE_KEYS.OFFERS, JSON.stringify(offers));
    notifyChange();
    return newOffer;
  },

  updateOffer(id: string, updates: Partial<Offer>): Offer | null {
    const offers = this.getOffers();
    const index = offers.findIndex((o) => o.id === id);
    if (index === -1) return null;
    offers[index] = { ...offers[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.OFFERS, JSON.stringify(offers));
    notifyChange();
    return offers[index];
  },

  deleteOffer(id: string): boolean {
    const offers = this.getOffers().filter((o) => o.id !== id);
    localStorage.setItem(STORAGE_KEYS.OFFERS, JSON.stringify(offers));
    notifyChange();
    return true;
  },

  // COUPONS SYSTEM
  getCoupons(): Coupon[] {
    const data = localStorage.getItem(STORAGE_KEYS.COUPONS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(DEFAULT_COUPONS));
      return DEFAULT_COUPONS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return DEFAULT_COUPONS;
    }
  },

  addCoupon(coupon: Omit<Coupon, 'id' | 'usedCount'>): Coupon {
    const coupons = this.getCoupons();
    const newCoupon: Coupon = {
      ...coupon,
      id: 'coup_' + Date.now(),
      usedCount: 0,
    };
    coupons.unshift(newCoupon);
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(coupons));
    notifyChange();
    return newCoupon;
  },

  updateCoupon(id: string, updates: Partial<Coupon>): Coupon | null {
    const coupons = this.getCoupons();
    const index = coupons.findIndex((c) => c.id === id);
    if (index === -1) return null;
    coupons[index] = { ...coupons[index], ...updates };
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(coupons));
    notifyChange();
    return coupons[index];
  },

  deleteCoupon(id: string): boolean {
    const coupons = this.getCoupons().filter((c) => c.id !== id);
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(coupons));
    notifyChange();
    return true;
  },

  validateCoupon(code: string, subtotal: number): { valid: boolean; discount: number; message: string; coupon?: Coupon } {
    const cleanCode = code.trim().toUpperCase();
    const coupons = this.getCoupons();
    const coupon = coupons.find((c) => c.code.toUpperCase() === cleanCode && c.active);

    if (!coupon) {
      return { valid: false, discount: 0, message: 'كود الخصم غير صحيح أو غير مفعل' };
    }

    if (subtotal < coupon.minimumOrder) {
      return {
        valid: false,
        discount: 0,
        message: `الحد الأدنى لتطبيق هذا الكوبون هو ${coupon.minimumOrder} ج.م`,
      };
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return { valid: false, discount: 0, message: 'لقد وصل هذا الكوبون إلى الحد الأقصى للاستخدام' };
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = Math.round((subtotal * coupon.discountValue) / 100);
      if (coupon.maximumDiscount && discount > coupon.maximumDiscount) {
        discount = coupon.maximumDiscount;
      }
    } else {
      discount = coupon.discountValue;
    }

    return {
      valid: true,
      discount: Math.min(discount, subtotal),
      message: `تم تطبيق خصم بقيمة ${discount} ج.م بنجاح!`,
      coupon,
    };
  },

  incrementCouponUsage(code: string): void {
    const coupons = this.getCoupons();
    const coupon = coupons.find((c) => c.code.toUpperCase() === code.trim().toUpperCase());
    if (coupon) {
      coupon.usedCount += 1;
      localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(coupons));
    }
  },

  // GALLERY
  getGalleryImages(): GalleryImage[] {
    const data = localStorage.getItem(STORAGE_KEYS.GALLERY);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(DEFAULT_GALLERY));
      return DEFAULT_GALLERY;
    }
    try {
      return JSON.parse(data);
    } catch {
      return DEFAULT_GALLERY;
    }
  },

  addGalleryImage(img: Omit<GalleryImage, 'id' | 'createdAt'>): GalleryImage {
    const images = this.getGalleryImages();
    const newImage: GalleryImage = {
      ...img,
      id: 'gal_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    images.unshift(newImage);
    localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(images));
    notifyChange();
    return newImage;
  },

  saveGalleryImage(img: Omit<GalleryImage, 'id' | 'createdAt'>): GalleryImage {
    return this.addGalleryImage(img);
  },

  deleteGalleryImage(id: string): boolean {
    const images = this.getGalleryImages().filter((img) => img.id !== id);
    localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(images));
    notifyChange();
    return true;
  },

  // REVIEWS
  getReviews(): Review[] {
    const data = localStorage.getItem(STORAGE_KEYS.REVIEWS);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(DEFAULT_REVIEWS));
      return DEFAULT_REVIEWS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return DEFAULT_REVIEWS;
    }
  },

  addReview(review: { authorName: string; rating: number; content: string }): Review {
    const reviews = this.getReviews();
    const newRev: Review = {
      id: 'rev_' + Date.now(),
      authorName: review.authorName.trim(),
      rating: review.rating,
      date: 'اليوم',
      content: review.content.trim(),
      status: 'approved',
      isVerified: false,
    };
    reviews.unshift(newRev);
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
    notifyChange();
    return newRev;
  },

  updateReviewStatus(id: string, status: 'approved' | 'hidden' | 'pending'): void {
    const reviews = this.getReviews();
    const rev = reviews.find((r) => r.id === id);
    if (rev) {
      rev.status = status;
      localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
      notifyChange();
    }
  },

  deleteReview(id: string): void {
    const reviews = this.getReviews().filter((r) => r.id !== id);
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
    notifyChange();
  },

  // CONTACT MESSAGES
  getMessages(): ContactMessage[] {
    const data = localStorage.getItem(STORAGE_KEYS.MESSAGES);
    if (!data) {
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(DEFAULT_MESSAGES));
      return DEFAULT_MESSAGES;
    }
    try {
      return JSON.parse(data);
    } catch {
      return DEFAULT_MESSAGES;
    }
  },

  addMessage(msg: { name: string; phone: string; message: string }): ContactMessage {
    const messages = this.getMessages();
    const newMsg: ContactMessage = {
      id: 'msg_' + Date.now(),
      name: msg.name.trim(),
      phone: msg.phone.trim(),
      message: msg.message.trim(),
      isRead: false,
      createdAt: new Date().toISOString(),
    };
    messages.unshift(newMsg);
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
    notifyChange();
    return newMsg;
  },

  markMessageRead(id: string, isRead = true): void {
    const messages = this.getMessages();
    const msg = messages.find((m) => m.id === id);
    if (msg) {
      msg.isRead = isRead;
      localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
      notifyChange();
    }
  },

  deleteMessage(id: string): void {
    const messages = this.getMessages().filter((m) => m.id !== id);
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(messages));
    notifyChange();
  },

  // ADMIN AUTH
  isAdminAuthenticated(): boolean {
    return localStorage.getItem(STORAGE_KEYS.ADMIN_AUTH) === 'true';
  },

  setAdminAuthenticated(auth: boolean): void {
    if (auth) {
      localStorage.setItem(STORAGE_KEYS.ADMIN_AUTH, 'true');
    } else {
      localStorage.removeItem(STORAGE_KEYS.ADMIN_AUTH);
    }
    notifyChange();
  },

  // RESET TO INITIAL SEED
  resetToDefaults(): void {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(DEFAULT_SETTINGS));
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(DEFAULT_CATEGORIES));
    localStorage.setItem(STORAGE_KEYS.MENU_ITEMS, JSON.stringify(DEFAULT_MENU_ITEMS));
    localStorage.setItem(STORAGE_KEYS.GALLERY, JSON.stringify(DEFAULT_GALLERY));
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(DEFAULT_REVIEWS));
    localStorage.setItem(STORAGE_KEYS.MESSAGES, JSON.stringify(DEFAULT_MESSAGES));
    localStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(DEFAULT_TABLES));
    localStorage.setItem(STORAGE_KEYS.COUPONS, JSON.stringify(DEFAULT_COUPONS));
    localStorage.removeItem(STORAGE_KEYS.OFFERS);
    localStorage.removeItem(STORAGE_KEYS.ORDERS);
    localStorage.removeItem(STORAGE_KEYS.CUSTOMERS);
    localStorage.removeItem(STORAGE_KEYS.CART);
    notifyChange();
  },
};
