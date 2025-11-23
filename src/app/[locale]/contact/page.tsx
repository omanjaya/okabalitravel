"use client";

import { useState } from "react";
import { Icons } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setSubmitStatus("success");
      setIsSubmitting(false);
      setFormData({ name: "", email: "", phone: "", subject: "", message: "" });
    }, 1500);
  };

  const contactInfo = [
    {
      icon: <Icons.mapPin size={24} weight="duotone" className="text-sky-600" />,
      title: "Alamat",
      content: "Jl. Raya Ubud No. 123, Ubud, Bali 80571",
    },
    {
      icon: <Icons.phone size={24} weight="duotone" className="text-sky-600" />,
      title: "Telepon",
      content: "+62 361 12345678",
    },
    {
      icon: <Icons.envelope size={24} weight="duotone" className="text-sky-600" />,
      title: "Email",
      content: "info@okabalitravel.com",
    },
    {
      icon: <Icons.clock size={24} weight="duotone" className="text-sky-600" />,
      title: "Jam Operasional",
      content: "Senin - Sabtu: 09:00 - 18:00",
    },
  ];

  return (
    <div className="min-h-screen pt-24 pb-16">
      {/* Hero Section */}
      <section className="relative h-[300px] bg-gradient-to-r from-sky-600 to-emerald-500 flex items-center justify-center">
        <div className="container mx-auto px-4 text-center text-white">
          <h1 className="text-5xl md:text-6xl font-bold mb-4">Hubungi Kami</h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto">
            Kami siap membantu meren canakan liburan impian Anda di Bali
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="lg:col-span-1 space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  Informasi Kontak
                </h2>
                <div className="space-y-4">
                  {contactInfo.map((info, index) => (
                    <Card key={index}>
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-3">
                          <div className="flex-shrink-0">{info.icon}</div>
                          <div>
                            <h3 className="font-semibold text-gray-900 mb-1">
                              {info.title}
                            </h3>
                            <p className="text-gray-600 text-sm">{info.content}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Social Media */}
              <div>
                <h3 className="font-semibold text-gray-900 mb-4">Ikuti Kami</h3>
                <div className="flex space-x-3">
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Icons.facebook size={20} weight="duotone" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Icons.instagram size={20} weight="duotone" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Icons.youtube size={20} weight="duotone" />
                  </Button>
                  <Button variant="outline" size="icon" className="rounded-full">
                    <Icons.whatsapp size={20} weight="duotone" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <Card>
                <CardContent className="p-8">
                  <h2 className="text-2xl font-bold text-gray-900 mb-6">
                    Kirim Pesan
                  </h2>

                  {submitStatus === "success" && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3 text-green-800">
                      <Icons.checkCircle size={20} weight="fill" />
                      <p>Pesan Anda berhasil dikirim! Kami akan segera menghubungi Anda.</p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nama Lengkap *</Label>
                        <Input
                          id="name"
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          required
                          placeholder="Masukkan nama lengkap"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          required
                          placeholder="nama@email.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Nomor Telepon</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          placeholder="+62 xxx xxxx xxxx"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">Subjek *</Label>
                        <Input
                          id="subject"
                          value={formData.subject}
                          onChange={(e) =>
                            setFormData({ ...formData, subject: e.target.value })
                          }
                          required
                          placeholder="Subjek pesan"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Pesan *</Label>
                      <Textarea
                        id="message"
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        required
                        rows={6}
                        placeholder="Tuliskan pesan Anda di sini..."
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full md:w-auto"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <Icons.spinner size={20} className="mr-2 animate-spin" />
                          Mengirim...
                        </>
                      ) : (
                        <>
                          <Icons.envelope size={20} className="mr-2" />
                          Kirim Pesan
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
            Lokasi Kami
          </h2>
          <div className="aspect-video w-full max-w-4xl mx-auto bg-gray-200 rounded-lg flex items-center justify-center">
            <p className="text-gray-500">Google Maps Embed akan ditampilkan di sini</p>
          </div>
        </div>
      </section>
    </div>
  );
}
