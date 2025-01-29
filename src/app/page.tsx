'use client'

import { useState } from 'react'
import JobCard from '@/components/JobCard'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search, MapPin, Filter, X } from 'lucide-react'
import { JobType, UserRole } from '@prisma/client'

const cities = [
  'İstanbul',
  'Ankara',
  'İzmir',
  'Antalya',
  'Bursa',
  'Adana',
  'Gaziantep',
  'Konya',
  'Mersin',
  'Diyarbakır',
] as const;

export default function HomePage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [location, setLocation] = useState('')
  const [selectedTypes, setSelectedTypes] = useState<Set<JobType>>(new Set())
  const [selectedLevels, setSelectedLevels] = useState<Set<string>>(new Set())
  const [selectedCities, setSelectedCities] = useState<Set<string>>(new Set())
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  const toggleJobType = (type: JobType) => {
    const newTypes = new Set(selectedTypes)
    if (newTypes.has(type)) {
      newTypes.delete(type)
    } else {
      newTypes.add(type)
    }
    setSelectedTypes(newTypes)
  }

  const toggleLevel = (level: string) => {
    const newLevels = new Set(selectedLevels)
    if (newLevels.has(level)) {
      newLevels.delete(level)
    } else {
      newLevels.add(level)
    }
    setSelectedLevels(newLevels)
  }

  const toggleCity = (city: string) => {
    const newCities = new Set(selectedCities)
    if (newCities.has(city)) {
      newCities.delete(city)
    } else {
      newCities.add(city)
    }
    setSelectedCities(newCities)
  }

  const jobTypeLabels: Record<JobType, string> = {
    FULL_TIME: 'Tam Zamanlı',
    PART_TIME: 'Yarı Zamanlı',
    INTERNSHIP: 'Stajyer',
    CONTRACT: 'Sözleşmeli',
  }

  const experienceLevels = ['0-2 Yıl', '2-5 Yıl', '5-10 Yıl', '10+ Yıl']

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Search */}
      <div className="relative isolate overflow-hidden bg-white">
        <div className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80">
          <div
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-navy-600 to-navy-400 opacity-20 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
            style={{
              clipPath:
                'polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)',
            }}
          />
        </div>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-gray-900">
              <span className="text-navy-600 block">
                Avukat İş İlanları
              </span>
              <span className="mt-2 block">
                Tek Bir Yerde
              </span>
            </h1>
            <p className="mt-4 sm:mt-6 text-base sm:text-lg leading-8 text-gray-600 px-4">
              Türkiye'nin önde gelen hukuk bürolarında ve şirketlerindeki fırsatlar sizi bekliyor.
            </p>
          </div>

          {/* Search Section */}
          <div className="mx-auto mt-6 sm:mt-10 max-w-3xl px-4">
            <div className="flex flex-col gap-3 md:flex-row md:gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="İş unvanı veya anahtar kelime"
                  className="block w-full rounded-lg border-0 py-2.5 pl-10 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-navy-600 sm:text-sm sm:leading-6"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <div className="relative flex-1">
                <MapPin className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Şehir"
                  className="block w-full rounded-lg border-0 py-2.5 pl-10 pr-4 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-navy-600 sm:text-sm sm:leading-6"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                />
              </div>
              <button
                type="button"
                className="inline-flex items-center justify-center gap-x-2 rounded-lg bg-navy-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-navy-700 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-navy-600 md:px-6"
              >
                <Search className="-ml-0.5 h-5 w-5" aria-hidden="true" />
                Ara
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 sm:py-16">
        {/* Mobile Filter Button */}
        <div className="lg:hidden mb-4">
          <button
            type="button"
            className="w-full flex items-center justify-center gap-x-2.5 rounded-lg bg-white px-3 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
            onClick={() => setShowMobileFilters(true)}
          >
            <Filter className="-ml-0.5 h-5 w-5" aria-hidden="true" />
            Filtreleri Göster
          </button>
        </div>

        <div className="lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Filters */}
          <div
            className={`${
              showMobileFilters ? 'fixed inset-0 z-40 lg:relative lg:inset-auto' : 'hidden lg:relative lg:block'
            } lg:col-span-3`}
          >
            {/* Backdrop */}
            {showMobileFilters && (
              <div className="fixed inset-0 bg-black bg-opacity-25 lg:hidden" onClick={() => setShowMobileFilters(false)} />
            )}

            {/* Filters Panel */}
            <div className={`
              ${showMobileFilters ? 'fixed inset-y-0 right-0 z-50 w-full overflow-y-auto bg-white px-4 py-4 sm:px-6 sm:py-6 sm:max-w-sm sm:ring-1 sm:ring-gray-900/10 lg:relative lg:block lg:w-full lg:px-0 lg:py-0' : ''}
              lg:block
            `}>
              <div className="flex items-center justify-between lg:hidden">
                <h2 className="text-lg font-medium text-gray-900">Filtreler</h2>
                <button
                  type="button"
                  className="-mr-2 flex h-10 w-10 items-center justify-center rounded-md bg-white p-2 text-gray-400 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-navy-500"
                  onClick={() => setShowMobileFilters(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <X className="h-6 w-6" aria-hidden="true" />
                </button>
              </div>

              <div className="mt-4 lg:mt-0">
                <div className="space-y-4">
                  {/* Job Type Filters */}
                  <div className="border border-gray-200 rounded-lg p-6 bg-white">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">İş Tipi</h3>
                    <div className="space-y-3">
                      {Object.entries(jobTypeLabels).map(([type, label]) => (
                        <label key={type} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedTypes.has(type as JobType)}
                            onChange={() => toggleJobType(type as JobType)}
                            className="h-4 w-4 rounded border-gray-300 text-navy-600 focus:ring-navy-600"
                          />
                          <span className="ml-2 text-sm text-gray-700">{label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* City Filters */}
                  <div className="border border-gray-200 rounded-lg p-6 bg-white">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">Şehir</h3>
                    <div className="space-y-3">
                      {cities.map((city) => (
                        <label key={city} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedCities.has(city)}
                            onChange={() => toggleCity(city)}
                            className="h-4 w-4 rounded border-gray-300 text-navy-600 focus:ring-navy-600"
                          />
                          <span className="ml-2 text-sm text-gray-700">{city}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Experience Level Filters */}
                  <div className="border border-gray-200 rounded-lg p-6 bg-white">
                    <h3 className="text-base font-semibold text-gray-900 mb-4">Deneyim Seviyesi</h3>
                    <div className="space-y-3">
                      {experienceLevels.map((level) => (
                        <label key={level} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedLevels.has(level)}
                            onChange={() => toggleLevel(level)}
                            className="h-4 w-4 rounded border-gray-300 text-navy-600 focus:ring-navy-600"
                          />
                          <span className="ml-2 text-sm text-gray-700">{level}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Job Listings */}
          <div className="mt-6 lg:col-span-9 lg:mt-0">
            <div className="grid gap-6">
              <JobCard
                job={{
                  id: '1',
                  title: 'Kıdemli Avukat',
                  company: 'ABC Hukuk Bürosu',
                  location: 'İstanbul',
                  type: JobType.FULL_TIME,
                  createdAt: new Date(),
                  updatedAt: new Date(),
                  description: 'Senior lawyer position at a prestigious law firm.',
                  employerId: '1',
                  employer: {
                    id: '1',
                    name: 'ABC Hukuk',
                    email: 'contact@abchukuk.com',
                    password: null,
                    googleId: null,
                    role: UserRole.EMPLOYER,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                  }
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 