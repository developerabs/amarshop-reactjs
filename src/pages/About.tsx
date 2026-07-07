import { useEffect } from "react";
import {
  Heart,
  Users,
  Award,
  Truck,
  Shield,
  Globe,
  Star,
  CheckCircle
} from "lucide-react";

export default function About() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const stats = [
    { label: "Happy Customers", value: "50K+", icon: Users },
    { label: "Products Delivered", value: "100K+", icon: Truck },
    { label: "Years of Service", value: "5+", icon: Award },
    { label: "Customer Rating", value: "4.8/5", icon: Star }
  ];

  const values = [
    {
      icon: Heart,
      title: "Customer First",
      description: "Everything we do is centered around providing the best experience for our customers."
    },
    {
      icon: Shield,
      title: "Quality Assurance",
      description: "We ensure every product meets the highest standards of quality and authenticity."
    },
    {
      icon: Globe,
      title: "Nationwide Delivery",
      description: "Fast and reliable delivery across Bangladesh with our extensive logistics network."
    },
    {
      icon: CheckCircle,
      title: "Trusted Service",
      description: "Building trust through transparent practices and excellent customer service."
    }
  ];

  const team = [
    {
      name: "Ahmed Rahman",
      role: "CEO & Founder",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Fatima Khan",
      role: "Head of Operations",
      image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Mohammad Ali",
      role: "Head of Technology",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face"
    },
    {
      name: "Ayesha Begum",
      role: "Customer Experience Lead",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face"
    }
  ];

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-emerald-50 to-emerald-100 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-black text-gray-900 tracking-tight mb-6">
            About AmarShop
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Bangladesh's premier destination for premium lifestyle products. We're committed to bringing
            the world's best brands to your doorstep with exceptional service and care.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <stat.icon className="w-8 h-8 text-emerald-600" />
                </div>
                <div className="text-3xl font-black text-gray-900 mb-2">{stat.value}</div>
                <div className="text-sm font-bold text-gray-600 uppercase tracking-widest">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-6">Our Story</h2>
              <div className="space-y-4 text-gray-600 leading-relaxed">
                <p>
                  Founded in 2021, AmarShop began with a simple mission: to make premium products
                  accessible to everyone in Bangladesh. We recognized that while global brands offered
                  exceptional quality, the shopping experience was often complicated and expensive.
                </p>
                <p>
                  Starting from a small warehouse in Dhaka, we've grown into Bangladesh's most trusted
                  ecommerce platform. Our journey has been driven by listening to our customers and
                  continuously improving our service to exceed expectations.
                </p>
                <p>
                  Today, we serve thousands of customers daily, offering a curated selection of products
                  from fashion to electronics, all backed by our commitment to quality, authenticity,
                  and exceptional customer service.
                </p>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&h=400&fit=crop"
                alt="Our story"
                className="rounded-2xl shadow-xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-4">Our Values</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The principles that guide everything we do at AmarShop
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-xl font-black text-gray-900 mb-3">{value.title}</h3>
                <p className="text-gray-600 leading-relaxed">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Team */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-4">Meet Our Team</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              The passionate people behind AmarShop's success
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <div key={index} className="text-center">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-black text-gray-900 mb-1">{member.name}</h3>
                <p className="text-emerald-600 font-bold">{member.role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-black text-gray-900 tracking-tight mb-4">Why Choose AmarShop?</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              What sets us apart from other ecommerce platforms
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Shield className="w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3">100% Authentic</h3>
              <p className="text-gray-600">
                Every product is verified for authenticity with genuine warranties and certificates.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Truck className="w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3">Fast Delivery</h3>
              <p className="text-gray-600">
                Same-day delivery in Dhaka and fast nationwide shipping across Bangladesh.
              </p>
            </div>
            <div className="text-center">
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Users className="w-10 h-10 text-emerald-600" />
              </div>
              <h3 className="text-xl font-black text-gray-900 mb-3">24/7 Support</h3>
              <p className="text-gray-600">
                Round-the-clock customer support through chat, phone, and email.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-emerald-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-black text-white tracking-tight mb-4">
            Ready to Experience the Difference?
          </h2>
          <p className="text-emerald-100 mb-8 text-lg">
            Join thousands of satisfied customers who trust AmarShop for their shopping needs.
          </p>
          <a
            href="/"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-emerald-600 font-black text-lg rounded-full hover:bg-gray-50 transition-all"
          >
            Start Shopping
          </a>
        </div>
      </section>
    </main>
  );
}