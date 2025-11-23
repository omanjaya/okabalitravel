import { Icons } from "@/lib/icons";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
  const values = [
    {
      icon: <Icons.heart size={32} weight="duotone" className="text-sky-600" />,
      title: "Passion for Bali",
      description: "Kami mencintai Bali dan berkomitmen untuk berbagi keindahannya dengan dunia",
    },
    {
      icon: <Icons.shield size={32} weight="duotone" className="text-sky-600" />,
      title: "Terpercaya",
      description: "Pengalaman wisata yang aman dan terpercaya dengan tim profesional",
    },
    {
      icon: <Icons.users size={32} weight="duotone" className="text-sky-600" />,
      title: "Customer First",
      description: "Kepuasan pelanggan adalah prioritas utama kami",
    },
    {
      icon: <Icons.globe size={32} weight="duotone" className="text-sky-600" />,
      title: "Sustainable Tourism",
      description: "Kami berkomitmen pada pariwisata berkelanjutan dan ramah lingkungan",
    },
  ];

  const team = [
    {
      name: "Made Adi",
      role: "Founder & CEO",
      image: "/team/placeholder.jpg",
    },
    {
      name: "Wayan Sari",
      role: "Head of Operations",
      image: "/team/placeholder.jpg",
    },
    {
      name: "Ketut Budi",
      role: "Tour Manager",
      image: "/team/placeholder.jpg",
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero Section */}
      <section className="relative h-[400px] bg-gradient-to-r from-sky-600 to-emerald-500 flex items-center justify-center">
        <div className="container mx-auto px-4 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Tentang Kami</h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto">
            Menjelajahi Keindahan Bali Bersama OkabaliTravel
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Cerita Kami
            </h2>
            <div className="prose prose-lg max-w-none text-gray-700 space-y-4">
              <p>
                OkabaliTravel didirikan dengan satu misi sederhana: membuat pengalaman
                wisata di Bali menjadi lebih mudah, menyenangkan, dan berkesan untuk
                semua orang.
              </p>
              <p>
                Sejak tahun 2020, kami telah melayani ribuan wisatawan dari seluruh dunia,
                membantu mereka menemukan keindahan tersembunyi Bali, merasakan budaya lokal
                yang kaya, dan menciptakan kenangan yang tak terlupakan.
              </p>
              <p>
                Kami percaya bahwa setiap perjalanan harus istimewa. Itulah mengapa tim kami
                bekerja keras untuk merancang paket wisata yang disesuaikan dengan kebutuhan
                Anda, mulai dari petualangan seru hingga retreat yang menenangkan.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Nilai-Nilai Kami
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Prinsip yang memandu setiap langkah kami
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map((value, index) => (
              <Card key={index} className="text-center">
                <CardContent className="pt-6">
                  <div className="flex justify-center mb-4">{value.icon}</div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-2">
                    {value.title}
                  </h3>
                  <p className="text-gray-600 text-sm">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Tim Kami
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Orang-orang berdedikasi di balik OkabaliTravel
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <div className="w-48 h-48 rounded-full bg-gradient-to-br from-sky-400 to-emerald-400 mx-auto mb-4 flex items-center justify-center text-white text-6xl font-bold">
                  {member.name.charAt(0)}
                </div>
                <h3 className="font-semibold text-xl text-gray-900">{member.name}</h3>
                <p className="text-gray-600">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gradient-to-r from-sky-600 to-emerald-500 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">5000+</div>
              <div className="text-lg opacity-90">Happy Travelers</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">100+</div>
              <div className="text-lg opacity-90">Tour Packages</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">50+</div>
              <div className="text-lg opacity-90">Destinations</div>
            </div>
            <div>
              <div className="text-4xl md:text-5xl font-bold mb-2">4.9</div>
              <div className="text-lg opacity-90">Average Rating</div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
