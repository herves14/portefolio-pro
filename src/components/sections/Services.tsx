"use client";

import { motion } from "framer-motion";
import {
  FaGlobe,
  FaMobileAlt,
  FaDatabase,
  FaRobot,
} from "react-icons/fa";

const Services = () => {
  const services = [
    {
      icon: FaGlobe,
      title: "Création de sites web",
      description:
        "Sites web modernes, responsives et optimisés pour tous vos besoins professionnels.",
    },
    {
      icon: FaMobileAlt,
      title: "Applications web/mobile",
      description:
        "Applications performantes et intuitives pour web et mobile avec les dernières technologies.",
    },
    {
      icon: FaDatabase,
      title: "Systèmes de gestion",
      description:
        "Solutions de gestion sur mesure pour automatiser vos processus métier.",
    },
    {
      icon: FaRobot,
      title: "Automatisation de processus",
      description:
        "Optimisation et automatisation de vos workflows pour gagner en efficacité.",
    },
  ];

  return (
    <section
      id="services"
      className="py-20 bg-white"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Mes Services
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Des solutions complètes pour transformer vos idées en réalité
            digitale
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <motion.div
                key={service.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="bg-gradient-to-br from-primary-50 to-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-2"
              >
                <div className="w-16 h-16 bg-primary-600 rounded-lg flex items-center justify-center mb-6 mx-auto">
                  <Icon className="text-white text-2xl" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 text-center">
                  {service.title}
                </h3>
                <p className="text-gray-600 text-center">
                  {service.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Services;
