import { Product, Category, Order, Subscription, Access, SubscriptionPlanInfo, User } from './types';

// Categories
export const categories: Category[] = [
  { id: '1', name: 'AI Prompt Pack', slug: 'ai-prompt-pack', created_at: '2024-01-01' },
  { id: '2', name: 'AI Workflow', slug: 'ai-workflow', created_at: '2024-01-01' },
  { id: '3', name: 'Automation Template', slug: 'automation-template', created_at: '2024-01-01' },
  { id: '4', name: 'Business Template', slug: 'business-template', created_at: '2024-01-01' },
  { id: '5', name: 'Content Creation Kit', slug: 'content-creation-kit', created_at: '2024-01-01' },
  { id: '6', name: 'Social Media Kit', slug: 'social-media-kit', created_at: '2024-01-01' },
  { id: '7', name: 'AI Agent Add-on', slug: 'ai-agent-addon', created_at: '2024-01-01' },
  { id: '8', name: 'Subscription Access', slug: 'subscription-access', created_at: '2024-01-01' },
  { id: '9', name: 'Mini Course', slug: 'mini-course', created_at: '2024-01-01' },
  { id: '10', name: 'Digital Toolkit', slug: 'digital-toolkit', created_at: '2024-01-01' },
];

// Products
export const products: Product[] = [
  {
    id: '1',
    name: 'Business Prompt Pack',
    slug: 'business-prompt-pack',
    description: 'A comprehensive collection of 100+ AI prompts designed specifically for business operations. Includes prompts for customer service, marketing, sales, HR, and strategic planning. Each prompt is tested and optimized for ChatGPT, Claude, and Gemini.',
    short_description: '100+ AI prompts for business operations, marketing, sales, and strategic planning.',
    price: 149000,
    category_id: '1',
    category: categories[0],
    product_type: 'prompt_pack',
    file_url: '#',
    preview_image: '/images/products/business-prompt.jpg',
    is_active: true,
    badges: ['best_seller', 'instant_access'],
    features: [
      '100+ tested AI prompts',
      'Covers 5 business areas',
      'Works with ChatGPT, Claude, Gemini',
      'Copy-paste ready',
      'Free updates for 6 months',
      'Bonus: Prompt engineering tips PDF'
    ],
    faq: [
      { question: 'What AI tools do these prompts work with?', answer: 'These prompts are optimized for ChatGPT, Claude, and Google Gemini. They can also be adapted for other AI tools.' },
      { question: 'Will I get updates?', answer: 'Yes, you will receive free updates for 6 months after purchase.' },
      { question: 'Can I use these for my team?', answer: 'The license covers personal and single-team use. For enterprise licensing, please contact us.' }
    ],
    format: 'PDF + Notion Template',
    access_method: 'Instant download after payment confirmation',
    update_policy: 'Free updates for 6 months',
    support: 'WhatsApp support available',
    created_at: '2024-01-15',
  },
  {
    id: '2',
    name: 'TikTok/Reels Content Prompt Pack',
    slug: 'tiktok-reels-content-prompt-pack',
    description: 'Create viral short-form video content with AI. This prompt pack includes 80+ prompts for TikTok and Instagram Reels content ideas, scripts, hooks, captions, and hashtag strategies. Perfect for content creators and social media managers.',
    short_description: '80+ prompts for TikTok & Reels content creation, scripts, hooks, and captions.',
    price: 99000,
    category_id: '5',
    category: categories[4],
    product_type: 'prompt_pack',
    file_url: '#',
    preview_image: '/images/products/tiktok-prompt.jpg',
    is_active: true,
    badges: ['new', 'instant_access'],
    features: [
      '80+ content prompts',
      'Video script templates',
      'Hook formulas that work',
      'Caption & hashtag strategies',
      'Trending content frameworks',
      'Bonus: Content calendar template'
    ],
    faq: [
      { question: 'Is this suitable for beginners?', answer: 'Absolutely! Each prompt comes with clear instructions and examples.' },
      { question: 'What niches does this cover?', answer: 'The prompts are designed to be adaptable to any niche. We include examples from business, lifestyle, education, and entertainment.' }
    ],
    format: 'PDF + Google Sheets',
    access_method: 'Instant download after payment confirmation',
    update_policy: 'Free updates for 3 months',
    support: 'WhatsApp support available',
    created_at: '2024-02-01',
  },
  {
    id: '3',
    name: 'Business SOP Template',
    slug: 'business-sop-template',
    description: 'Ready-to-use Standard Operating Procedure templates for small businesses. Includes 20+ SOP templates covering customer service, sales processes, onboarding, social media management, inventory, and more. Built with AI integration points.',
    short_description: '20+ SOP templates for small businesses with AI integration points.',
    price: 199000,
    category_id: '4',
    category: categories[3],
    product_type: 'template',
    file_url: '#',
    preview_image: '/images/products/sop-template.jpg',
    is_active: true,
    badges: ['best_seller'],
    features: [
      '20+ ready-to-use SOP templates',
      'Covers key business areas',
      'AI integration suggestions',
      'Editable in Google Docs/Notion',
      'Process flow diagrams included',
      'Bonus: SOP creation guide'
    ],
    faq: [
      { question: 'Can I customize these templates?', answer: 'Yes, all templates are fully editable. You can customize them to fit your business processes.' },
      { question: 'Do I need technical knowledge?', answer: 'No, the templates are designed for non-technical users with clear instructions.' }
    ],
    format: 'Google Docs + Notion',
    access_method: 'Access link after payment confirmation',
    update_policy: 'Free updates for 6 months',
    support: 'WhatsApp support available',
    created_at: '2024-01-20',
  },
  {
    id: '4',
    name: 'AI Customer Service Script',
    slug: 'ai-customer-service-script',
    description: 'Complete AI-powered customer service script templates for WhatsApp, email, and live chat. Includes response templates, escalation flows, FAQ generators, and chatbot conversation designs. Perfect for businesses setting up AI customer support.',
    short_description: 'AI-powered customer service scripts for WhatsApp, email, and live chat.',
    price: 179000,
    category_id: '4',
    category: categories[3],
    product_type: 'template',
    file_url: '#',
    preview_image: '/images/products/cs-script.jpg',
    is_active: true,
    badges: ['instant_access'],
    features: [
      '50+ response templates',
      'WhatsApp, email & live chat scripts',
      'Escalation flow templates',
      'AI chatbot conversation designs',
      'Complaint handling scripts',
      'Multilingual templates (ID/EN)'
    ],
    faq: [
      { question: 'Can I use this with my existing chatbot?', answer: 'Yes, the scripts can be adapted to work with any chatbot platform or AI tool.' },
      { question: 'Are the scripts in Bahasa Indonesia?', answer: 'Yes, templates are available in both Bahasa Indonesia and English.' }
    ],
    format: 'Google Docs + PDF',
    access_method: 'Instant download after payment confirmation',
    update_policy: 'Free updates for 3 months',
    support: 'WhatsApp support available',
    created_at: '2024-02-10',
  },
  {
    id: '5',
    name: 'WhatsApp CS Bot Knowledge Base Template',
    slug: 'whatsapp-cs-bot-knowledge-base',
    description: 'Build your WhatsApp customer service bot with this comprehensive knowledge base template. Includes structured FAQ templates, product information frameworks, troubleshooting guides, and integration guides for popular WhatsApp bot platforms.',
    short_description: 'Knowledge base template for building WhatsApp customer service bots.',
    price: 249000,
    category_id: '7',
    category: categories[6],
    product_type: 'addon',
    file_url: '#',
    preview_image: '/images/products/wa-bot-kb.jpg',
    is_active: true,
    badges: ['new'],
    features: [
      'Structured FAQ framework',
      'Product info templates',
      'Troubleshooting guide templates',
      'Integration guides included',
      'Scalable knowledge structure',
      'Bonus: Bot testing checklist'
    ],
    faq: [
      { question: 'Which bot platforms does this work with?', answer: 'The knowledge base is platform-agnostic but includes specific integration guides for popular platforms.' },
      { question: 'Do I need coding knowledge?', answer: 'Basic understanding of chatbot platforms is helpful, but the templates themselves do not require coding.' }
    ],
    format: 'Notion + Google Sheets',
    access_method: 'Access link after payment confirmation',
    update_policy: 'Free updates for 6 months',
    support: 'Priority WhatsApp support',
    created_at: '2024-02-15',
  },
  {
    id: '6',
    name: 'Automation Workflow Pack',
    slug: 'automation-workflow-pack',
    description: 'A collection of 15+ automation workflows for small businesses. Includes ready-to-import workflows for email automation, social media posting, lead management, invoice generation, and customer follow-up. Compatible with Make.com and Zapier.',
    short_description: '15+ automation workflows for Make.com and Zapier.',
    price: 299000,
    category_id: '2',
    category: categories[1],
    product_type: 'workflow',
    file_url: '#',
    preview_image: '/images/products/automation-pack.jpg',
    is_active: true,
    badges: ['best_seller', 'instant_access'],
    features: [
      '15+ ready-to-import workflows',
      'Compatible with Make.com & Zapier',
      'Email automation workflows',
      'Social media auto-posting',
      'Lead management flows',
      'Setup documentation included'
    ],
    faq: [
      { question: 'Do I need a paid Make.com/Zapier account?', answer: 'Some workflows work on free plans, but premium workflows may require a paid account.' },
      { question: 'Can I customize the workflows?', answer: 'Yes, all workflows are fully customizable after import.' }
    ],
    format: 'JSON blueprints + PDF guide',
    access_method: 'Instant download after payment confirmation',
    update_policy: 'Free updates for 6 months',
    support: 'WhatsApp support available',
    created_at: '2024-01-25',
  },
  {
    id: '7',
    name: 'Landing Page Copywriting Kit',
    slug: 'landing-page-copywriting-kit',
    description: 'Create high-converting landing page copy with AI. This kit includes copywriting frameworks, headline formulas, CTA templates, and AI prompt sequences for generating complete landing page copy. Works for any product or service.',
    short_description: 'Copywriting frameworks and AI prompts for high-converting landing pages.',
    price: 129000,
    category_id: '5',
    category: categories[4],
    product_type: 'kit',
    file_url: '#',
    preview_image: '/images/products/copywriting-kit.jpg',
    is_active: true,
    badges: ['promo'],
    features: [
      '10+ copywriting frameworks',
      '50+ headline formulas',
      'CTA template library',
      'AI prompt sequences',
      'Before/after examples',
      'Bonus: A/B testing guide'
    ],
    faq: [
      { question: 'Is this for specific industries?', answer: 'No, the frameworks and templates are designed to work across all industries.' },
      { question: 'Do I need copywriting experience?', answer: 'No, the kit is designed for beginners with step-by-step guidance.' }
    ],
    format: 'PDF + Notion',
    access_method: 'Instant download after payment confirmation',
    update_policy: 'Free updates for 3 months',
    support: 'WhatsApp support available',
    created_at: '2024-02-05',
  },
  {
    id: '8',
    name: 'AI Agent Skill Pack',
    slug: 'ai-agent-skill-pack',
    description: 'Expand your AI agent capabilities with this skill pack. Includes pre-built conversation flows, knowledge base templates, personality configurations, and response quality frameworks for AI agents. Perfect for Opal Agent customers.',
    short_description: 'Pre-built skills and configurations for AI agents.',
    price: 349000,
    category_id: '7',
    category: categories[6],
    product_type: 'addon',
    file_url: '#',
    preview_image: '/images/products/agent-skill.jpg',
    is_active: true,
    badges: ['new', 'instant_access'],
    features: [
      'Pre-built conversation flows',
      'Knowledge base templates',
      'Personality configurations',
      'Response quality frameworks',
      'Testing & QA checklists',
      'Integration documentation'
    ],
    faq: [
      { question: 'Is this compatible with Opal Agent?', answer: 'Yes, this skill pack is designed specifically to work with Opal Agent setups.' },
      { question: 'Can I use this with other AI platforms?', answer: 'The frameworks and templates can be adapted for most AI agent platforms.' }
    ],
    format: 'Notion + JSON configs',
    access_method: 'Access link after payment confirmation',
    update_policy: 'Free updates for 6 months',
    support: 'Priority WhatsApp support',
    created_at: '2024-02-20',
  },
  {
    id: '9',
    name: 'Monthly AI Tools Subscription',
    slug: 'monthly-ai-tools-subscription',
    description: 'Get monthly access to our growing library of AI tools, templates, and resources. New products added every month. Includes access to subscriber-only products, early access to new releases, and priority support.',
    short_description: 'Monthly access to premium AI tools, templates, and resources library.',
    price: 99000,
    category_id: '8',
    category: categories[7],
    product_type: 'subscription',
    file_url: '#',
    preview_image: '/images/products/monthly-sub.jpg',
    is_active: true,
    badges: ['subscription'],
    features: [
      'Access to full product library',
      'New products every month',
      'Subscriber-only products',
      'Early access to new releases',
      'Priority WhatsApp support',
      'Monthly AI tips newsletter'
    ],
    faq: [
      { question: 'How does the subscription work?', answer: 'After payment confirmation, you get access to all subscription products for 30 days. Renew monthly to keep access.' },
      { question: 'Can I cancel anytime?', answer: 'Yes, simply do not renew your subscription at the end of the month.' }
    ],
    format: 'Online access',
    access_method: 'Dashboard access after payment confirmation',
    update_policy: 'Continuous updates during subscription',
    support: 'Priority WhatsApp support',
    created_at: '2024-01-01',
  },
  {
    id: '10',
    name: 'Digital Business Starter Kit',
    slug: 'digital-business-starter-kit',
    description: 'Everything you need to start your digital business with AI. This comprehensive kit includes business plan templates, branding guides, social media templates, email templates, customer service scripts, and AI tool setup guides.',
    short_description: 'Complete starter kit for launching a digital business with AI tools.',
    price: 499000,
    category_id: '10',
    category: categories[9],
    product_type: 'toolkit',
    file_url: '#',
    preview_image: '/images/products/starter-kit.jpg',
    is_active: true,
    badges: ['best_seller', 'promo'],
    features: [
      'Business plan templates',
      'Brand identity guide',
      'Social media template pack',
      'Email marketing templates',
      'Customer service scripts',
      'AI tool setup guides',
      'Financial planning spreadsheets',
      '90-day launch roadmap'
    ],
    faq: [
      { question: 'Is this suitable for complete beginners?', answer: 'Yes! This kit is designed for people starting their first digital business.' },
      { question: 'How much do I get in this kit?', answer: 'The kit includes 50+ templates and guides across 8 business areas.' },
      { question: 'Do I get support?', answer: 'Yes, WhatsApp support is available for any questions about using the kit.' }
    ],
    format: 'Google Drive folder with organized resources',
    access_method: 'Access link after payment confirmation',
    update_policy: 'Free updates for 12 months',
    support: 'Priority WhatsApp support',
    created_at: '2024-02-01',
  },
];

// Subscription Plans
export const subscriptionPlans: SubscriptionPlanInfo[] = [
  {
    name: 'basic',
    display_name: 'Basic',
    price: 79000,
    period: '/month',
    description: 'Perfect for individuals who need access to selected digital products and monthly updates.',
    features: [
      'Access to basic products',
      'Monthly product updates',
      'Standard WhatsApp support',
      '5 downloads per month',
      'Community access',
    ],
    highlighted: false,
  },
  {
    name: 'pro',
    display_name: 'Pro',
    price: 149000,
    period: '/month',
    description: 'For professionals who need more premium resources and priority support.',
    features: [
      'All Basic benefits',
      'Access to premium products',
      'Priority WhatsApp support',
      'Unlimited downloads',
      'Bonus prompts & templates monthly',
      'Early access to new products',
      'Exclusive Pro-only resources',
    ],
    highlighted: true,
    badge: 'Most Popular',
  },
  {
    name: 'business',
    display_name: 'Business',
    price: 299000,
    period: '/month',
    description: 'For small businesses that need comprehensive access and consultation support.',
    features: [
      'All Pro benefits',
      'Business-oriented resources',
      'Priority support (response < 2 hours)',
      'Light AI consultation (1x/month)',
      'Workflow & automation bonuses',
      'Team access (up to 3 members)',
      'Custom template requests',
      'Quarterly business review',
    ],
    highlighted: false,
    badge: 'Best Value',
  },
];

// Mock users for demo
export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'John Doe',
    email: 'john@example.com',
    phone: '6281234567890',
    role: 'user',
    created_at: '2024-01-10',
  },
  {
    id: 'admin-1',
    name: 'Admin Opal',
    email: 'admin@opalstore.com',
    phone: '6281234567891',
    role: 'admin',
    created_at: '2024-01-01',
  },
];

// Mock orders
export const mockOrders: Order[] = [
  {
    id: 'ORD-001',
    user_id: 'user-1',
    product_id: '1',
    product: products[0],
    total_price: 149000,
    payment_method: 'bank_transfer',
    payment_status: 'paid',
    order_status: 'delivered',
    payment_proof_url: null,
    full_name: 'John Doe',
    email: 'john@example.com',
    whatsapp: '6281234567890',
    created_at: '2024-02-01',
  },
  {
    id: 'ORD-002',
    user_id: 'user-1',
    product_id: '6',
    product: products[5],
    total_price: 299000,
    payment_method: 'qris',
    payment_status: 'waiting_confirmation',
    order_status: 'pending',
    payment_proof_url: null,
    full_name: 'John Doe',
    email: 'john@example.com',
    whatsapp: '6281234567890',
    created_at: '2024-02-15',
  },
];

// Mock subscriptions
export const mockSubscriptions: Subscription[] = [
  {
    id: 'SUB-001',
    user_id: 'user-1',
    plan_name: 'pro',
    status: 'active',
    start_date: '2024-02-01',
    end_date: '2024-03-01',
    price: 149000,
    created_at: '2024-02-01',
  },
];

// Mock access
export const mockAccess: Access[] = [
  {
    id: 'ACC-001',
    user_id: 'user-1',
    product_id: '1',
    product: products[0],
    order_id: 'ORD-001',
    access_url: '#',
    created_at: '2024-02-01',
  },
];

// FAQ data for homepage
export const homeFAQ = [
  {
    question: 'What is OpalStore?',
    answer: 'OpalStore is a digital product store by Opal Agent. We sell AI prompts, templates, workflows, automation tools, and subscription plans to help you leverage AI for your business.',
  },
  {
    question: 'How do I receive my product after purchase?',
    answer: 'After payment is confirmed by our admin, you can access your purchased products directly from your dashboard. You will receive download links or access links depending on the product type.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'Currently, we accept manual bank transfer and QRIS payments. You can also confirm your order via WhatsApp. Payment gateway integration is coming soon.',
  },
  {
    question: 'How does the subscription work?',
    answer: 'Choose a subscription plan, complete payment, and get access to subscription-based products for the duration of your plan. Renew monthly to maintain access.',
  },
  {
    question: 'Can I get a refund?',
    answer: 'Since these are digital products, we generally do not offer refunds after access is granted. However, if you experience issues, please contact us via WhatsApp and we will do our best to help.',
  },
  {
    question: 'Do I need technical knowledge to use these products?',
    answer: 'No! All our products are designed for beginners. Each product comes with clear instructions and documentation. Plus, our WhatsApp support is always available if you need help.',
  },
];
