import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { ArrowRight, ArrowUpRight, Users, BarChart, Code, PenTool } from 'lucide-react'
import ProjectCard from '@/components/projects/project-card'
import TestimonialSlider from '@/components/testimonial-slider'
import { projects, partners } from '@/lib/data'
import ScrollButton from '@/components/scroll-button'

export default function Home() {
  return (
    <div className="flex flex-col w-full">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-background/90 via-background/50 to-background/20 dark:from-background/95 dark:via-background/80 dark:to-background/95 z-10" />
          <Image 
            src="https://images.pexels.com/photos/3861458/pexels-photo-3861458.jpeg?auto=compress&cs=tinysrgb&w=1600" 
            alt="Hero background" 
            fill 
            className="object-cover"
            priority
          />
        </div>
        
        <div className="container relative z-20 px-4 md:px-6">
          <div className="max-w-3xl">
            <h1 className="font-playfair text-4xl md:text-5xl lg:text-7xl font-bold tracking-tight mb-6">
              We craft digital experiences that elevate brands
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 max-w-xl">
              Strategy-led design and technology for forward-thinking brands and businesses.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" className="text-base" asChild>
                <Link href="/projects">
                  View Our Projects
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="text-base bg-white border border-blue-400 hover:bg-blue-50" asChild>
                <Link href="/contact">
                  Get in Touch
                </Link>
              </Button>
            </div>
          </div>
        </div>
        
        <div className="absolute bottom-12 left-0 right-0 flex justify-center">
          <ScrollButton />
        </div>
      </section>
      
      {/* Services Section */}
      <section id="services-section" className="py-24 bg-muted/30">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16">
            <div className="max-w-md mb-8 md:mb-0">
              <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-4">Our Services</h2>
              <p className="text-muted-foreground whitespace-nowrap">
                We blend strategy, design, and technology to create impactful digital solutions.
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              {
                icon: <PenTool className="h-10 w-10" />,
                title: 'Brand Identity',
                description: 'We create distinctive visual systems that embody your brand values.'
              },
              {
                icon: <Code className="h-10 w-10" />,
                title: 'Web Development',
                description: 'Custom web solutions built with cutting-edge technologies for performance and scalability.'
              },
              {
                icon: <Users className="h-10 w-10" />,
                title: 'UX Design',
                description: 'Human-centered design that creates intuitive, engaging experiences for your users.'
              },
              {
                icon: <BarChart className="h-10 w-10" />,
                title: 'Digital Marketing',
                description: 'Data-driven strategies to increase your visibility and drive meaningful engagement.'
              }
            ].map((service, i) => (
              <div key={i} className="group p-8 bg-card rounded-lg border border-border hover:border-primary/50 transition-all duration-300">
                <div className="text-primary mb-6">{service.icon}</div>
                <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                <p className="text-muted-foreground">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Featured Projects */}
      <section className="py-24">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16">
            <div className="max-w-md mb-8 md:mb-0">
              <h2 className="font-playfair text-3xl md:text-4xl font-bold mb-4">Featured Projects</h2>
              <p className="text-muted-foreground">
                A selection of our recent work across various industries.
              </p>
            </div>
            <Button variant="outline" asChild>
              <Link href="/projects">
                View All Projects
                <ArrowUpRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {projects.slice(0, 3).map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      </section>
      
      {/* Testimonials */}
      <section className="py-24 bg-muted/30">
        <div className="container px-4 md:px-6">
          <h2 className="font-playfair text-3xl md:text-4xl font-bold text-center mb-16">
            What Our Clients Say
          </h2>
          
          <TestimonialSlider />
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container px-4 md:px-6">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="font-playfair text-3xl md:text-5xl font-bold mb-6">
              Ready to start your project?
            </h2>
            <p className="text-primary-foreground/80 text-xl mb-8 max-w-xl mx-auto">
              Let's create something exceptional together. Get in touch with our team to discuss your ideas.
            </p>
            <Button size="lg" variant="secondary" asChild>
              <Link href="/contact">
                Get in Touch
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}