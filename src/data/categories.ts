import { 
  ShoppingBag, Smartphone, Home, Heart, User, Baby, Tv, Watch, Utensils, 
  Dumbbell, Book, Car, Briefcase, Wrench, PawPrint 
} from "lucide-react";

export const HIERARCHICAL_CATEGORIES = [
  {
    name: "Women's Fashion",
    icon: ShoppingBag,
    subCategories: [
      {
        name: "Clothing",
        childCategories: ["Dresses", "Tops", "Skirts", "Pants"]
      },
      {
        name: "Shoes",
        childCategories: ["Heels", "Flats", "Boots", "Sneakers"]
      }
    ]
  },
  {
    name: "Electronic Devices",
    icon: Smartphone,
    subCategories: [
      {
        name: "Mobiles",
        childCategories: ["Smartphones", "Feature Phones", "Tablets", "Refurbished Phones"]
      },
      {
        name: "Laptops",
        childCategories: ["Gaming Laptops", "MacBooks", "Business Laptops", "2-in-1 Laptops"]
      },
      {
        name: "Desktops",
        childCategories: ["All-in-One", "Gaming PCs", "Mini PCs", "Workstations"]
      }
    ]
  },
  { 
    name: "Home & Lifestyle", 
    icon: Home,
    subCategories: [
      {
        name: "Furniture",
        childCategories: ["Living Room", "Bedroom", "Kitchen", "Office"]
      },
      {
        name: "Decor",
        childCategories: ["Wall Art", "Lighting", "Rugs", "Curtains"]
      }
    ]
  },
  { 
    name: "Health & Beauty", 
    icon: Heart,
    subCategories: [
      {
        name: "Skincare",
        childCategories: ["Moisturizers", "Serums", "Cleansers", "Sunscreen"]
      },
      {
        name: "Makeup",
        childCategories: ["Face", "Eyes", "Lips", "Brushes"]
      }
    ]
  },
  { 
    name: "Men's Fashion", 
    icon: User,
    subCategories: [
      {
        name: "Clothing",
        childCategories: ["Shirts", "T-Shirts", "Jeans", "Suits"]
      },
      {
        name: "Accessories",
        childCategories: ["Watches", "Wallets", "Belts", "Sunglasses"]
      }
    ]
  },
  { 
    name: "Babies & Toys", 
    icon: Baby,
    subCategories: [
      {
        name: "Baby Gear",
        childCategories: ["Strollers", "Car Seats", "Walkers"]
      },
      {
        name: "Toys",
        childCategories: ["Action Figures", "Dolls", "Puzzles"]
      }
    ]
  },
  { 
    name: "TV & Home Appliances", 
    icon: Tv,
    subCategories: [
      {
        name: "Televisions",
        childCategories: ["Smart TVs", "OLED TVs", "LED TVs"]
      },
      {
        name: "Appliances",
        childCategories: ["Refrigerators", "Washing Machines", "Microwaves"]
      }
    ]
  },
  { 
    name: "Electronic Accessories", 
    icon: Watch,
    subCategories: [
      {
        name: "Wearables",
        childCategories: ["Smartwatches", "Fitness Trackers"]
      },
      {
        name: "Audio",
        childCategories: ["Headphones", "Speakers"]
      }
    ]
  },
  { 
    name: "Grocery & Food", 
    icon: Utensils,
    subCategories: [
      {
        name: "Cooking Essentials",
        childCategories: ["Oil", "Rice", "Flour"]
      },
      {
        name: "Snacks",
        childCategories: ["Chocolates", "Chips", "Biscuits"]
      }
    ]
  },
  {
    name: "Sports & Outdoors",
    icon: Dumbbell,
    subCategories: [
      {
        name: "Exercise",
        childCategories: ["Treadmills", "Dumbbells", "Yoga Mats"]
      },
      {
        name: "Outdoor",
        childCategories: ["Camping", "Cycling", "Fishing"]
      }
    ]
  },
  {
    name: "Books & Stationery",
    icon: Book,
    subCategories: [
      {
        name: "Books",
        childCategories: ["Fiction", "Non-Fiction", "Academic"]
      },
      {
        name: "Stationery",
        childCategories: ["Pens", "Notebooks", "Art Supplies"]
      }
    ]
  },
  {
    name: "Automotive",
    icon: Car,
    subCategories: [
      {
        name: "Car Accessories",
        childCategories: ["Interior", "Exterior", "Electronics"]
      },
      {
        name: "Motorbike",
        childCategories: ["Helmets", "Riding Gear", "Parts"]
      }
    ]
  },
  {
    name: "Watches & Accessories",
    icon: Watch,
    subCategories: [
      {
        name: "Men's Watches",
        childCategories: ["Luxury", "Casual", "Sports"]
      },
      {
        name: "Women's Watches",
        childCategories: ["Fashion", "Classic", "Jewelry"]
      }
    ]
  },
  {
    name: "Bags & Luggage",
    icon: Briefcase,
    subCategories: [
      {
        name: "Backpacks",
        childCategories: ["Laptop Bags", "School Bags", "Travel"]
      },
      {
        name: "Handbags",
        childCategories: ["Tote Bags", "Clutches", "Wallets"]
      }
    ]
  },
  {
    name: "Tools & Hardware",
    icon: Wrench,
    subCategories: [
      {
        name: "Hand Tools",
        childCategories: ["Screwdrivers", "Wrenches", "Hammers"]
      },
      {
        name: "Power Tools",
        childCategories: ["Drills", "Saws", "Grinders"]
      }
    ]
  },
  {
    name: "Pet Supplies",
    icon: PawPrint,
    subCategories: [
      {
        name: "Dog Supplies",
        childCategories: ["Food", "Toys", "Grooming"]
      },
      {
        name: "Cat Supplies",
        childCategories: ["Litter", "Food", "Scratchers"]
      }
    ]
  },
  {
    name: "Office Supplies",
    icon: Briefcase,
    subCategories: [
      {
        name: "Furniture",
        childCategories: ["Desks", "Chairs", "Storage"]
      },
      {
        name: "Stationery",
        childCategories: ["Paper", "Pens", "Organizers"]
      }
    ]
  },
  {
    name: "Music & Instruments",
    icon: Tv,
    subCategories: [
      {
        name: "Instruments",
        childCategories: ["Guitars", "Keyboards", "Drums"]
      },
      {
        name: "Audio Equipment",
        childCategories: ["Microphones", "Interfaces", "Headphones"]
      }
    ]
  },
  {
    name: "Garden & Outdoor",
    icon: Home,
    subCategories: [
      {
        name: "Plants",
        childCategories: ["Seeds", "Flowers", "Trees"]
      },
      {
        name: "Tools",
        childCategories: ["Mowers", "Shovels", "Hose"]
      }
    ]
  }
];
