/*
 * Portfolio content.
 * To add a project or design, copy an existing entry and edit it.
 * Images live in public/assets/img/...
 */

window.PORTFOLIO = {
  projects: [
    {
      id: 'task-manager',
      title: 'Task Management Platform',
      subtitle: 'Authentication & CRUD App',
      category: 'fullstack',
      label: 'Full Stack · MERN',
      image: 'assets/img/projects/task-manager.svg',
      summary:
        'A secure task manager with user accounts, JWT authentication, REST APIs and a stats dashboard.',
      context: 'Full Stack Web Development Internship, Week 1 task',
      highlights: [
        'Secure user authentication with JWT, bcrypt.js password hashing and protected routes.',
        'Full CRUD for tasks through a REST API built with Node.js and Express.js.',
        'Responsive pages: Login, Register, Dashboard, Profile and Create/Edit Task.',
        'MongoDB collections for Users and Tasks, with search, filtering, pagination and dashboard statistics.',
        'Dark/light theme toggle and client-side form validation.',
      ],
      stack: ['React.js', 'Node.js', 'Express.js', 'MongoDB', 'JWT', 'bcrypt.js', 'Git'],
      links: [{ label: 'GitHub', icon: 'fa-brands fa-github', url: 'https://github.com/AleeshaAamir' }],
    },
    {
      id: 'shoporia',
      title: 'Shoporia E-Commerce',
      subtitle: 'Full Stack Web Application',
      category: 'fullstack',
      label: 'Full Stack · PHP',
      image: 'assets/img/projects/ecommerce.svg',
      summary:
        'An online store with product listings, a shopping cart, secure checkout and an admin panel for products and orders.',
      context: 'Personal project',
      highlights: [
        'Product catalogue with listings and product pages.',
        'Session-based cart: add, update and remove items with a live cart count.',
        'User registration/login and a checkout flow with an order confirmation page.',
        'Admin panel for managing products and orders.',
        'Support pages: contact, FAQ, shipping, returns and privacy policy.',
      ],
      stack: ['PHP', 'MySQL', 'JavaScript', 'Bootstrap', 'HTML5', 'CSS3'],
      links: [{ label: 'Source Code', icon: 'fa-brands fa-github', url: 'https://github.com/AleeshaAamir/shoporia' }],
    },
    {
      id: 'salon-app',
      title: 'Beauty Salon Mobile App',
      subtitle: 'Flutter Cross-Platform App',
      category: 'mobile',
      label: 'Mobile · Flutter',
      image: 'assets/img/projects/salon-app.svg',
      summary:
        'A cross-platform booking app for salon services, with a separate admin side for managing the business.',
      context: 'Academic group project',
      highlights: [
        'User login and sign-up, plus browsing salon services.',
        'Appointment booking with date, time and stylist selection.',
        'Admin interface for managing services, beauticians and appointments.',
        'Appointment status workflow: confirm, cancel and complete.',
      ],
      stack: ['Flutter', 'Dart'],
      links: [],
    },
    {
      id: 'figma-portfolio',
      title: 'UI/UX Portfolio Website',
      subtitle: 'Personal Portfolio Design in Figma',
      category: 'design',
      label: 'UI/UX · Figma',
      image: 'assets/img/figma/figma-cover.jpg',
      summary:
        'A complete personal portfolio website designed and prototyped in Figma with a modern, purple-accented dark theme.',
      context: 'Designed in Figma',
      highlights: [
        'Designed Home, About, Services and Portfolio sections as a complete, responsive layout.',
        'Consistent visual hierarchy and typography, with a modern purple-accented dark theme.',
        'Showcases 6+ website mock-ups for fashion, tech and product brands (see Design Work below).',
        'This website is built on that Figma design.',
      ],
      stack: ['Figma', 'UI/UX', 'Prototyping', 'Visual Design'],
      links: [{ label: 'View full design', icon: 'fa-regular fa-image', url: 'assets/img/figma/figma-full.jpg', lightbox: true }],
    },
  ],

  gallery: {
    web: [
      { src: 'assets/img/figma/adidas-fashion.jpg', title: 'Adidas Fashion Store', tag: 'Fashion Website Design' },
      { src: 'assets/img/figma/smartwatch-kids.jpg', title: 'Smart Watch for Kids', tag: 'Tech Product Landing Page' },
      { src: 'assets/img/figma/wp-developer-brand.jpg', title: 'Wizen WP Developer', tag: 'Agency Website Design' },
      { src: 'assets/img/figma/nike-jordan.jpg', title: 'Nike Air Jordan', tag: 'Product Website Design' },
      { src: 'assets/img/figma/redbull-sugarfree.jpg', title: 'Red Bull Sugarfree', tag: 'Product Website Design' },
      { src: 'assets/img/figma/dji-mavic-drone.jpg', title: 'DJI Mavic 4 Pro', tag: 'Tech Product Landing Page' },
    ],
    graphic: [
      { src: 'assets/img/graphics/web-developer-ad.jpg', title: 'Website Developer Ad', tag: 'Social Media Post' },
      { src: 'assets/img/graphics/internship-post.jpg', title: 'Internship Hiring Post', tag: 'Social Media Post' },
      { src: 'assets/img/graphics/hiring-post.jpg', title: "We're Hiring", tag: 'Social Media Post' },
      { src: 'assets/img/graphics/graphic-design-promo.jpg', title: 'Graphic Design Services', tag: 'Promotional Poster' },
      { src: 'assets/img/graphics/real-estate-flyer.jpg', title: 'Modern Home for Sale', tag: 'Real Estate Flyer' },
      { src: 'assets/img/graphics/business-flyer.jpg', title: 'Grow Your Business', tag: 'Business Flyer' },
      { src: 'assets/img/graphics/food-flyer.jpg', title: 'Delicious Food Service', tag: 'Restaurant Flyer' },
      { src: 'assets/img/graphics/online-courses-flyer.jpg', title: 'Online Courses', tag: 'Education Flyer' },
      { src: 'assets/img/graphics/scholarship-flyer.jpg', title: 'Scholarship Program 2040', tag: 'Education Flyer' },
      { src: 'assets/img/graphics/go-green-flyer.jpg', title: 'Go Green', tag: 'Awareness Flyer' },
      { src: 'assets/img/graphics/company-card.jpg', title: "Aleesha's Design", tag: 'Business Card & Branding' },
      { src: 'assets/img/graphics/developers-logo.jpg', title: 'Developers Logo', tag: 'Logo Design' },
      { src: 'assets/img/graphics/product-visualization.jpg', title: 'Product Visualization', tag: 'Packaging & Label Design' },
      { src: 'assets/img/graphics/cut-layer-illustration.jpg', title: 'Cut-Layer Illustration', tag: 'Illustrator Artwork' },
      { src: 'assets/img/graphics/design-world.jpg', title: 'Design World', tag: 'Vector Illustration' },
      { src: 'assets/img/graphics/character-design.jpg', title: 'Character Design', tag: 'Social Media Post' },
    ],
  },
};
