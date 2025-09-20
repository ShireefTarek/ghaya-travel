import { PrismaClient, CategoryKey, AddOnType, Role, PromoType, NotificationChannel, PostStatus } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  await prisma.notification.deleteMany();
  await prisma.flightSelection.deleteMany();
  await prisma.bookingAddon.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.review.deleteMany();
  await prisma.addOn.deleteMany();
  await prisma.itineraryItem.deleteMany();
  await prisma.package.deleteMany();
  await prisma.destination.deleteMany();
  await prisma.category.deleteMany();
  await prisma.blogPostTag.deleteMany();
  await prisma.pricingRule.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.blogCategory.deleteMany();
  await prisma.user.deleteMany();
  await prisma.currencyRate.deleteMany();
  await prisma.promoCode.deleteMany();

  const admin = await prisma.user.create({
    data: {
      name: 'Admin User',
      email: 'admin@ghayatravel.com',
      role: Role.admin,
      passwordHash: '$2a$10$EixZaYVK1fsbw1ZfbX3OXePaWxn96p36Z0MsQ8xO5h9X4u3n6Z8aS'
    }
  });

  const categories = await Promise.all(
    [
      { key: CategoryKey.domestic, name: 'رحلات داخلية' },
      { key: CategoryKey.international, name: 'رحلات خارجية' },
      { key: CategoryKey.cruise, name: 'رحلات نيلية وبحرية' },
      { key: CategoryKey.religious, name: 'رحلات دينية' },
      { key: CategoryKey.special, name: 'عروض خاصة' }
    ].map((category) => prisma.category.create({ data: category }))
  );

  const destinations = await prisma.destination.createMany({
    data: [
      {
        name: 'Cairo',
        country: 'Egypt',
        city: 'Cairo',
        lat: 30.0444,
        lng: 31.2357,
        description: 'Historic capital with pyramids, museums, and vibrant bazaars.',
        images: ['https://images.unsplash.com/photo-1582719478250-c89cae4dc85b']
      },
      {
        name: 'Luxor',
        country: 'Egypt',
        city: 'Luxor',
        lat: 25.6872,
        lng: 32.6396,
        description: 'Pharaonic temples and Nile cruises.',
        images: ['https://images.unsplash.com/photo-1548786817-4f3e64748fb3']
      },
      {
        name: 'Jeddah',
        country: 'Saudi Arabia',
        city: 'Jeddah',
        lat: 21.4858,
        lng: 39.1925,
        description: 'Gateway to Hajj and Umrah with seafront corniche.',
        images: ['https://images.unsplash.com/photo-1524492412937-b28074a5d7da']
      },
      {
        name: 'Milan',
        country: 'Italy',
        city: 'Milan',
        lat: 45.4642,
        lng: 9.19,
        description: 'Fashion capital with Duomo, galleries, and winter charm.',
        images: ['https://images.unsplash.com/photo-1546539782-6fc531453083']
      },
      {
        name: 'Geneva',
        country: 'Switzerland',
        city: 'Geneva',
        lat: 46.2044,
        lng: 6.1432,
        description: 'Lakeside city with Alpine excursions and chocolate experiences.',
        images: ['https://images.unsplash.com/photo-1582719478181-d9927f065ebe']
      }
    ]
  });

  const cairoCruise = await prisma.package.create({
    data: {
      category: { connect: { key: CategoryKey.domestic } },
      title: 'اكتشف القاهرة وكروز النيل | Discover Cairo & Nile Cruise – 5D4N',
      slug: 'cairo-nile-cruise-5d4n',
      summary:
        'استمتع بإقامة فاخرة في القاهرة يتخللها زيارة الأهرامات ثم رحلة نيلية إلى الأقصر وأسوان. // Premium 5-day immersion across Cairo and the Nile with curated excursions.',
      durationNights: 4,
      durationDays: 5,
      basePrice: 1450,
      currency: 'USD',
      highlights: ['زيارة الأهرامات والمتحف المصري', 'رحلة نيلية مع عشاء', 'جولات خاصة مع مرشد'],
      gallery: [
        'https://images.unsplash.com/photo-1582719231207-3c7c13060b80',
        'https://images.unsplash.com/photo-1509042239860-f550ce710b93'
      ],
      virtualTourUrl: 'https://www.youtube.com/watch?v=8N7NwBx0A3o',
      inclusions: ['إقامة 4 ليالٍ بفندق خمس نجوم', 'رحلة كروز نيلية ليلتين', 'مرشد سياحي معتمد'],
      exclusions: ['الرحلات الدولية', 'التأشيرة إن وجدت'],
      seoTitle: 'Discover Cairo & Nile Cruise – Ghaya Travel',
      seoDescription: 'Luxury 5D4N package with pyramids, Nile cruise, and curated experiences.',
      destinations: {
        connect: [{ name: 'Cairo' }, { name: 'Luxor' }]
      },
      itineraryItems: {
        create: [
          {
            dayNumber: 1,
            title: 'Arrivals & Welcome Dinner',
            description: 'Meet and assist at Cairo airport, sunset dinner on the Nile.',
            media: []
          },
          {
            dayNumber: 2,
            title: 'Giza Pyramids & Egyptian Museum',
            description: 'Private Egyptologist-led tour with optional camel ride.',
            media: []
          },
          {
            dayNumber: 3,
            title: 'Flight to Luxor & Cruise Boarding',
            description: 'Check-in on luxury Nile cruise with evening folklore show.',
            media: []
          }
        ]
      },
      addOns: {
        create: [
          {
            type: AddOnType.flight,
            title: 'Domestic Flight Cairo-Luxor-Cairo',
            description: 'Round-trip economy seats with baggage allowance.',
            price: 220,
            currency: 'USD'
          },
          {
            type: AddOnType.insurance,
            title: 'Comprehensive Travel Insurance',
            description: 'Emergency medical & trip cancellation coverage.',
            price: 45,
            currency: 'USD'
          }
        ]
      }
    }
  });

  const redSea = await prisma.package.create({
    data: {
      category: { connect: { key: CategoryKey.cruise } },
      title: 'رحلة كروز البحر الأحمر – Red Sea Explorer 4D3N',
      slug: 'red-sea-explorer-4d3n',
      summary:
        'كروز فاخر من سفاجا إلى الجونة مع أنشطة غوص وسهرات بحرية. // 4 days exploring the Red Sea aboard a boutique vessel.',
      durationNights: 3,
      durationDays: 4,
      basePrice: 890,
      currency: 'USD',
      highlights: ['شعاب مرجانية ملونة', 'أنشطة غوص وسباحة', 'تجربة طعام شرقية على متن السفينة'],
      gallery: ['https://images.unsplash.com/photo-1523906834658-6e24ef2386f9'],
      virtualTourUrl: 'https://www.youtube.com/watch?v=JtV6WQ3Q7YI',
      inclusions: ['إقامة بكابينة مطلة على البحر', 'وجبات كاملة', 'رحلات غوص يومية'],
      exclusions: ['معدات الغوص الشخصية'],
      seoTitle: 'Red Sea Explorer Cruise',
      seoDescription: 'Sail across the Red Sea with curated diving adventures.',
      destinations: {
        connect: [{ name: 'Cairo' }]
      },
      itineraryItems: {
        create: [
          {
            dayNumber: 1,
            title: 'Embarkation in Safaga',
            description: 'Welcome aboard with captain’s dinner.',
            media: []
          }
        ]
      }
    }
  });

  const umrahEconomy = await prisma.package.create({
    data: {
      category: { connect: { key: CategoryKey.religious } },
      title: 'عمرة اقتصادي 11 يوم (شروق الطلائع) + 4 أيام بالمدينة',
      slug: 'umrah-economy-11d',
      summary:
        'باقات عمرة متكاملة تشمل التأشيرة، السكن القريب من الحرم، المواصلات، والزيارات الدينية. // 11-day Umrah journey with Medina extension and spiritual guidance.',
      durationNights: 10,
      durationDays: 11,
      basePrice: 16000,
      currency: 'EGP',
      highlights: ['فنادق قريبة من الحرم', 'مشرف ديني متواجد 24/7', 'برامج زيارات اختيارية'],
      virtualTourUrl: 'https://www.youtube.com/watch?v=1xZp3PKW8Aw',
      inclusions: ['التأشيرة', 'الإقامة بفندق شروق الطلائع بمكة', 'الإقامة بفندق أنوار المدينة'],
      exclusions: ['الوجبات أثناء السفر', 'مصروفات شخصية'],
      seoTitle: 'Umrah Economy by Ghaya Travel',
      seoDescription: 'Affordable Umrah with premium guidance and Medina stay.',
      destinations: {
        connect: [{ name: 'Jeddah' }]
      },
      itineraryItems: {
        create: [
          {
            dayNumber: 1,
            title: 'الوصول إلى جدة والتوجه إلى مكة',
            description: 'استقبال المطار والمرافقة إلى الفندق لأداء العمرة.',
            media: []
          }
        ]
      },
      addOns: {
        create: [
          {
            type: AddOnType.transfer,
            title: 'حافلات VIP بين مكة والمدينة',
            price: 1800,
            currency: 'EGP'
          },
          {
            type: AddOnType.insurance,
            title: 'تأمين سفر للحجاج',
            price: 650,
            currency: 'EGP'
          }
        ]
      }
    }
  });

  const milanGeneva = await prisma.package.create({
    data: {
      category: { connect: { key: CategoryKey.international } },
      title: 'Milan & Geneva New Year – 8D7N',
      slug: 'milan-geneva-new-year-8d7n',
      summary:
        'Celebrate New Year between Italy and Switzerland with festive markets and Alpine adventures.',
      durationNights: 7,
      durationDays: 8,
      basePrice: 2490,
      currency: 'EUR',
      highlights: ['NYE gala dinner', 'Day trip to Montreux & Chamonix', 'Designer outlet shopping'],
      virtualTourUrl: 'https://www.youtube.com/watch?v=JgE6v4r2kAI',
      inclusions: ['4 nights in Milan 4* hotel', '3 nights in Geneva lakefront hotel', 'Airport transfers'],
      exclusions: ['International flights', 'Schengen visa'],
      seoTitle: 'New Year in Milan & Geneva',
      seoDescription: 'Festive European escape for the holidays.',
      destinations: {
        connect: [{ name: 'Milan' }, { name: 'Geneva' }]
      }
    }
  });


  await prisma.pricingRule.create({
    data: {
      package: { connect: { id: milanGeneva.id } },
      name: 'Festive Season Markup',
      percent: 12,
      startsAt: new Date(new Date().getFullYear(), 10, 15),
      endsAt: new Date(new Date().getFullYear(), 11, 31)
    }
  });
  await prisma.currencyRate.createMany({
    data: [
      { code: 'EGP', rateToEGP: 1, manual: true },
      { code: 'USD', rateToEGP: 30.5, manual: true },
      { code: 'EUR', rateToEGP: 33.2, manual: true }
    ]
  });

  await prisma.promoCode.create({
    data: {
      code: 'WELCOME2024',
      type: PromoType.percent,
      value: 5,
      validFrom: new Date(),
      validTo: new Date(new Date().setMonth(new Date().getMonth() + 3))
    }
  });

  const blogCategory = await prisma.blogCategory.create({
    data: {
      slug: 'travel-tips',
      title: 'Travel Tips'
    }
  });

  const tags = await prisma.tag.createMany({
    data: [
      { slug: 'egypt', title: 'Egypt' },
      { slug: 'umrah', title: 'Umrah' },
      { slug: 'luxury', title: 'Luxury' }
    ]
  });

  const tagRecords = await prisma.tag.findMany();

  const blogPosts = [
    {
      slug: 'essential-tips-for-egypt-travel',
      titleAr: 'نصائح أساسية للسفر في مصر',
      titleEn: 'Essential Tips for Traveling Egypt',
      summaryAr: 'أهم الإرشادات للاستمتاع برحلتك في مصر.',
      summaryEn: 'Practical guidance to maximise your Egyptian adventure.',
      contentAr: 'تعرّف على أفضل الأوقات للزيارة، وكيفية التعامل مع العملة المحلية، ونصائح السلامة.',
      contentEn:
        'Discover the best travel seasons, how to handle local currency, safety tips, and cultural etiquette.',
      coverImage: 'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee',
      categoryId: blogCategory.id,
      status: PostStatus.published,
      publishedAt: new Date(),
      tags: [tagRecords[0].id]
    },
    {
      slug: 'red-sea-highlights',
      titleAr: 'أجمل ما في البحر الأحمر',
      titleEn: 'Highlights of the Red Sea',
      summaryAr: 'دليل لأفضل الشواطئ والرحلات البحرية في مصر.',
      summaryEn: 'Your guide to the top beaches and cruises across the Red Sea.',
      contentAr: 'من الغردقة إلى مرسى علم، تعرف على أروع المواقع للغطس والراحة.',
      contentEn: 'Explore Hurghada, Marsa Alam, and hidden gems for divers and families.',
      coverImage: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c',
      categoryId: blogCategory.id,
      status: PostStatus.published,
      publishedAt: new Date(),
      tags: [tagRecords[0].id, tagRecords[2].id]
    },
    {
      slug: 'umrah-preparation-guide',
      titleAr: 'دليل الاستعداد لرحلة العمرة',
      titleEn: 'Umrah Preparation Guide',
      summaryAr: 'خطوات عملية لضمان رحلة روحية ميسرة.',
      summaryEn: 'Practical checklist for a smooth Umrah journey.',
      contentAr:
        'تعرف على متطلبات التأشيرة، ما يجب حمله، وكيفية اختيار برنامج العمرة الأنسب.',
      contentEn:
        'Understand visa requirements, packing lists, and how to choose the right Umrah package.',
      coverImage: 'https://images.unsplash.com/photo-1505739773368-56d1af021ba2',
      categoryId: blogCategory.id,
      status: PostStatus.published,
      publishedAt: new Date(),
      tags: [tagRecords[1].id]
    }
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.create({
      data: {
        slug: post.slug,
        titleAr: post.titleAr,
        titleEn: post.titleEn,
        summaryAr: post.summaryAr,
        summaryEn: post.summaryEn,
        contentAr: post.contentAr,
        contentEn: post.contentEn,
        coverImage: post.coverImage,
        category: { connect: { id: post.categoryId } },
        status: PostStatus.published,
        publishedAt: post.publishedAt,
        tags: {
          create: post.tags.map((tagId) => ({ tag: { connect: { id: tagId } } }))
        }
      }
    });
  }

  await prisma.notificationTemplate.createMany({
    data: [
      {
        channel: NotificationChannel.email,
        key: 'booking-confirmation',
        subject: 'Your Ghaya Travel booking',
        body: '<p>Thank you for booking with Ghaya Travel.</p>'
      },
      {
        channel: NotificationChannel.whatsapp,
        key: 'booking-confirmation',
        body: 'شكراً لاختيارك غاية للسياحة. تم تأكيد الحجز.'
      }
    ]
  });

  console.log('Seed data created successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
