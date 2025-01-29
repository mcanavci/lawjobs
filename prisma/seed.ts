import { PrismaClient, JobType, UserRole, JobSource } from '@prisma/client'
import { hash } from 'bcrypt'

const prisma = new PrismaClient()

async function main() {
  // Create an employer account
  const hashedPassword = await hash('password123', 10)
  const employer = await prisma.user.create({
    data: {
      email: 'employer@example.com',
      password: hashedPassword,
      role: 'EMPLOYER',
      name: 'Test Employer',
    },
  })

  const jobListings = [
    {
      title: 'Kıdemli Kurumsal Avukat',
      company: 'Global Hukuk Bürosu',
      location: 'İstanbul',
      type: JobType.FULL_TIME,
      salary: '40.000 - 60.000 TL',
      description: `<p>Global Hukuk Bürosu, İstanbul ofisinde görevlendirilmek üzere Kıdemli Kurumsal Avukat aramaktadır.</p>
        <p><strong>İş Tanımı:</strong></p>
        <ul>
          <li>Şirketler hukuku alanında danışmanlık hizmeti vermek</li>
          <li>Sözleşmelerin hazırlanması ve müzakere edilmesi</li>
          <li>Şirket birleşme ve devralmaları süreçlerinin yönetimi</li>
          <li>Hukuki due diligence çalışmalarının yürütülmesi</li>
        </ul>`,
      requirements: [
        'En az 5 yıl kurumsal hukuk deneyimi',
        'İngilizce - Akıcı seviyede',
        'Tercihen yurtdışı tecrübesi',
        'Seyahat engeli olmayan',
      ],
    },
    {
      title: 'Stajyer Avukat',
      company: 'Anadolu Hukuk',
      location: 'Ankara',
      type: JobType.INTERNSHIP,
      description: `<p>Ankara'nın önde gelen hukuk bürolarından Anadolu Hukuk, stajyer avukat aramaktadır.</p>
        <p><strong>Sorumluluklar:</strong></p>
        <ul>
          <li>Dava dosyalarının hazırlanması ve takibi</li>
          <li>Duruşmalara katılım</li>
          <li>Hukuki araştırmalar ve raporlama</li>
          <li>Müvekkil görüşmelerine katılım</li>
        </ul>`,
      requirements: [
        'Hukuk Fakültesi son sınıf öğrencisi veya mezunu',
        'MS Office programlarına hakimiyet',
        'Analitik düşünme yeteneği',
        'Takım çalışmasına yatkın',
      ],
    },
    {
      title: 'Kıdemli İş Hukuku Avukatı',
      company: 'Ege Hukuk Danışmanlık',
      location: 'İzmir',
      type: JobType.FULL_TIME,
      salary: '35.000 - 45.000 TL',
      description: `<p>İzmir'in köklü hukuk bürolarından Ege Hukuk Danışmanlık, iş hukuku departmanını güçlendirmek üzere deneyimli avukat aramaktadır.</p>
        <p><strong>Pozisyon Detayları:</strong></p>
        <ul>
          <li>İş hukuku davalarının takibi</li>
          <li>İş sözleşmelerinin hazırlanması</li>
          <li>Toplu iş hukuku süreçlerinin yönetimi</li>
          <li>İşveren-çalışan uyuşmazlıklarının çözümü</li>
        </ul>`,
      requirements: [
        'En az 7 yıl iş hukuku alanında deneyim',
        'Tercihen yüksek lisans derecesi',
        'İş Mahkemeleri tecrübesi',
        'Müzakere becerileri kuvvetli',
      ],
    },
    {
      title: 'Avukat - Gayrimenkul Hukuku',
      company: 'Akdeniz Hukuk',
      location: 'Antalya',
      type: JobType.FULL_TIME,
      salary: '25.000 - 35.000 TL',
      description: `<p>Akdeniz Hukuk bünyesinde görevlendirilmek üzere Gayrimenkul Hukuku alanında deneyimli avukat aranmaktadır.</p>
        <p><strong>Temel Sorumluluklar:</strong></p>
        <ul>
          <li>Gayrimenkul alım-satım süreçlerinin yönetimi</li>
          <li>Tapu işlemlerinin takibi</li>
          <li>İmar hukuku davalarının yürütülmesi</li>
          <li>Kat mülkiyeti uyuşmazlıklarının çözümü</li>
        </ul>`,
      requirements: [
        'En az 3 yıl gayrimenkul hukuku deneyimi',
        'Tapu ve Kadastro mevzuatına hakimiyet',
        'Aktif araç kullanımı',
        'Esnek çalışma saatlerine uyum',
      ],
    },
  ]

  for (const job of jobListings) {
    await prisma.job.create({
      data: {
        ...job,
        employerId: employer.id,
        isActive: true,
        source: JobSource.DIRECT,
      },
    })
  }

  console.log('Seed data created successfully')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  }) 