"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const About = () => {
  const skills = [
    { name: "React / Next.js", level: 90 },
    { name: "Node.js / Express", level: 85 },
    { name: "TypeScript", level: 88 },
    { name: "PostgreSQL / MongoDB", level: 80 },
    { name: "Tailwind CSS", level: 92 },
    { name: "Git / GitHub", level: 85 },
  ];

  return (
    <section
      id="apropos"
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
            À Propos de Moi
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Passionné par le développement et l&apos;innovation digitale
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Photo */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="relative w-full h-96 rounded-xl overflow-hidden shadow-2xl">
              <Image
                src="/portofolio.jpg"
                alt="Photo professionnelle"
                fill
                className="object-cover"
                onError={(e) => {
                  // Fallback si l'image n'existe pas
                  const target = e.target as HTMLImageElement;
                  target.src =
                    "https://via.placeholder.com/600x800/3b82f6/ffffff?text=Photo+Pro";
                }}
              />
            </div>
          </motion.div>

          {/* Contenu */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Mon Parcours
              </h3>
              <p className="text-gray-600 leading-relaxed mb-4">
                Développeur Full-Stack passionné avec plusieurs années
                d&apos;expérience dans la création de solutions digitales innovantes.
                Spécialisé dans le développement web moderne, je transforme vos
                idées en applications performantes et élégantes.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Basé à Cotonou, Bénin, je travaille avec des entreprises et des
                entrepreneurs pour créer des solutions sur mesure qui répondent
                à leurs besoins spécifiques.
              </p>
            </div>

            <div>
              <h3 className="text-2xl font-bold text-gray-900 mb-6">
                Compétences Techniques
              </h3>
              <div className="space-y-4">
                {skills.map((skill, index) => (
                  <div key={skill.name}>
                    <div className="flex justify-between mb-2">
                      <span className="font-medium text-gray-700">
                        {skill.name}
                      </span>
                      <span className="text-gray-600">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${skill.level}%` }}
                        viewport={{ once: true }}
                        transition={{
                          delay: index * 0.1,
                          duration: 1,
                          ease: "easeOut",
                        }}
                        className="bg-gradient-to-r from-primary-500 to-primary-600 h-3 rounded-full"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4">
              <div className="inline-block px-6 py-3 bg-primary-100 rounded-lg">
                <span className="text-primary-700 font-semibold">
                  🎯 Plus de 5 ans d&apos;expérience
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default About;
