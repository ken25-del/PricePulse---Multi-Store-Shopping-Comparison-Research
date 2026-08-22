/**
 * High-resolution verified category product photography & fallback handler.
 * Ensures every product preview displays a real, crisp, relevant product image
 * across SSD/Storage, Footwear, Apparel, Electronics, Smartphones, Audio, Kitchen, Laptops, and Watches.
 */

const CATEGORY_IMAGES: Record<string, string[]> = {
  ssd: [
    'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1618424181497-157f25b6ddd5?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1563770660941-20978e870e26?w=800&auto=format&fit=crop&q=80'
  ],
  shoes: [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80'
  ],
  sneakers: [
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1584735935682-2f2b69dff9d2?w=800&auto=format&fit=crop&q=80'
  ],
  saree: [
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1609357605129-26f69add5d6e?w=800&auto=format&fit=crop&q=80'
  ],
  kurta: [
    'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=800&auto=format&fit=crop&q=80'
  ],
  shirt: [
    'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800&auto=format&fit=crop&q=80'
  ],
  jeans: [
    'https://images.unsplash.com/photo-1542272604-780c96856592?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80'
  ],
  dress: [
    'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800&auto=format&fit=crop&q=80'
  ],
  earbuds: [
    'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1572536147248-ac59a8abfa4b?w=800&auto=format&fit=crop&q=80'
  ],
  headphones: [
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=800&auto=format&fit=crop&q=80'
  ],
  watch: [
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800&auto=format&fit=crop&q=80'
  ],
  phone: [
    'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?w=800&auto=format&fit=crop&q=80'
  ],
  laptop: [
    'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=800&auto=format&fit=crop&q=80'
  ],
  tablet: [
    'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1561154464-82e9adf32764?w=800&auto=format&fit=crop&q=80'
  ],
  camera: [
    'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&auto=format&fit=crop&q=80'
  ],
  peripherals: [
    'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=800&auto=format&fit=crop&q=80'
  ],
  luggage: [
    'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=800&auto=format&fit=crop&q=80'
  ],
  tv: [
    'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1461151304267-38535e780c79?w=800&auto=format&fit=crop&q=80'
  ],
  kitchen: [
    'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1588854337236-6889d631faa8?w=800&auto=format&fit=crop&q=80'
  ],
  appliances: [
    'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=800&auto=format&fit=crop&q=80'
  ],
  beauty: [
    'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1608248597359-0a67a84092b7?w=800&auto=format&fit=crop&q=80'
  ],
  default: [
    'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&auto=format&fit=crop&q=80'
  ]
};

export function getRealProductImageFallback(title?: string, category?: string, index: number = 0): string {
  const query = `${title || ''} ${category || ''}`.toLowerCase();

  // SSD, Storage, Hard Drive, Flash Drive, Memory Card
  if (
    query.includes('ssd') ||
    query.includes('sandisk') ||
    query.includes('hard disk') ||
    query.includes('hard drive') ||
    query.includes('hdd') ||
    query.includes('nvme') ||
    query.includes('pendrive') ||
    query.includes('pen drive') ||
    query.includes('flash drive') ||
    query.includes('usb drive') ||
    query.includes('sd card') ||
    query.includes('memory card') ||
    query.includes('seagate') ||
    query.includes('western digital') ||
    query.includes('wd elements') ||
    query.includes('wd ') ||
    query.includes('crucial') ||
    query.includes('kingston') ||
    query.includes('portable storage')
  ) {
    const list = CATEGORY_IMAGES.ssd;
    return list[index % list.length];
  }

  // Tablet & iPad
  if (query.includes('tablet') || query.includes('ipad') || query.includes('galaxy tab')) {
    const list = CATEGORY_IMAGES.tablet;
    return list[index % list.length];
  }

  // Camera & Photography
  if (query.includes('camera') || query.includes('dslr') || query.includes('gopro') || query.includes('lens') || query.includes('nikon') || query.includes('canon')) {
    const list = CATEGORY_IMAGES.camera;
    return list[index % list.length];
  }

  // Keyboards, Mice, Monitors, Gaming
  if (query.includes('keyboard') || query.includes('mouse') || query.includes('monitor') || query.includes('display') || query.includes('gaming')) {
    const list = CATEGORY_IMAGES.peripherals;
    return list[index % list.length];
  }

  // Bags, Luggage, Backpacks
  if (query.includes('bag') || query.includes('backpack') || query.includes('luggage') || query.includes('suitcase') || query.includes('trolley') || query.includes('purse')) {
    const list = CATEGORY_IMAGES.luggage;
    return list[index % list.length];
  }

  // TV & Soundbars
  if (query.includes('tv') || query.includes('television') || query.includes('soundbar') || query.includes('oled') || query.includes('qled')) {
    const list = CATEGORY_IMAGES.tv;
    return list[index % list.length];
  }

  // Footwear
  if (query.includes('shoe') || query.includes('sneaker') || query.includes('puma') || query.includes('nike') || query.includes('adidas') || query.includes('boot') || query.includes('footwear') || query.includes('sandal') || query.includes('loafer')) {
    const list = CATEGORY_IMAGES.shoes;
    return list[index % list.length];
  }

  // Saree & Ethnic
  if (query.includes('saree') || query.includes('sari') || query.includes('zari') || query.includes('pallu') || query.includes('kanjivaram') || query.includes('banarasi') || query.includes('silk saree')) {
    const list = CATEGORY_IMAGES.saree;
    return list[index % list.length];
  }
  if (query.includes('kurta') || query.includes('kurti') || query.includes('ethnic') || query.includes('anarkali')) {
    const list = CATEGORY_IMAGES.kurta;
    return list[index % list.length];
  }

  // Western Apparel
  if (query.includes('shirt') || query.includes('t-shirt') || query.includes('tshirt') || query.includes('polo')) {
    const list = CATEGORY_IMAGES.shirt;
    return list[index % list.length];
  }
  if (query.includes('jean') || query.includes('denim') || query.includes('pant') || query.includes('trouser')) {
    const list = CATEGORY_IMAGES.jeans;
    return list[index % list.length];
  }
  if (query.includes('dress') || query.includes('top') || query.includes('skirt') || query.includes('lehenga')) {
    const list = CATEGORY_IMAGES.dress;
    return list[index % list.length];
  }

  // Earbuds & Audio
  if (query.includes('earbud') || query.includes('airpod') || query.includes('tws') || query.includes('airdopes') || query.includes('earphone')) {
    const list = CATEGORY_IMAGES.earbuds;
    return list[index % list.length];
  }
  if (query.includes('headphone') || query.includes('headset') || query.includes('audio') || query.includes('speaker') || query.includes('sony wh')) {
    const list = CATEGORY_IMAGES.headphones;
    return list[index % list.length];
  }

  // Smartwatch & Wearables
  if (query.includes('watch') || query.includes('smartwatch') || query.includes('clock') || query.includes('band') || query.includes('garmin') || query.includes('fitbit')) {
    const list = CATEGORY_IMAGES.watch;
    return list[index % list.length];
  }

  // Phones
  if (query.includes('phone') || query.includes('mobile') || query.includes('iphone') || query.includes('samsung') || query.includes('galaxy') || query.includes('pixel') || query.includes('oneplus') || query.includes('redmi') || query.includes('realme')) {
    const list = CATEGORY_IMAGES.phone;
    return list[index % list.length];
  }

  // Laptops
  if (query.includes('laptop') || query.includes('macbook') || query.includes('notebook') || query.includes('computer') || query.includes('pc') || query.includes('dell') || query.includes('thinkpad')) {
    const list = CATEGORY_IMAGES.laptop;
    return list[index % list.length];
  }

  // Kitchen & Home Appliances
  if (query.includes('fryer') || query.includes('cooker') || query.includes('blender') || query.includes('kettle') || query.includes('kitchen') || query.includes('pan') || query.includes('mixer') || query.includes('grinder') || query.includes('oven')) {
    const list = CATEGORY_IMAGES.kitchen;
    return list[index % list.length];
  }

  // Beauty
  if (query.includes('serum') || query.includes('cream') || query.includes('perfume') || query.includes('makeup') || query.includes('lotion') || query.includes('cosmetic')) {
    const list = CATEGORY_IMAGES.beauty;
    return list[index % list.length];
  }

  const def = CATEGORY_IMAGES.default;
  return def[index % def.length];
}

