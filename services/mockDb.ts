
import { UserRole } from '../types.js';

export let mockStores = [
  { id: 'store1', name: 'The Grand Market', email: 'contact@grandmarket.com', address: '100 Main Street, Shopsville', ownerId: 'storeowner1' },
  { id: 'store2', name: 'Corner Goods & Groceries', email: 'info@cornergoods.com', address: '202 Side Avenue, Normal Town' },
  { id: 'store3', name: 'Tech Universe Hub', email: 'support@techuniverse.com', address: '303 Tech Park, System City' },
  { id: 'store4', name: 'Bloom & Blossom Florist', email: 'flowers@bloom.com', address: '404 Rose Petal Lane, Garden City' },
  { id: 'store5', name: 'Gadget Central Emporium', email: 'contact@gadgetcentral.com', address: '505 Circuit Board Rd, Techville' },
  { id: 'store6', name: 'The Cozy Corner Bookstore', email: 'reads@cozycorner.com', address: '606 Page Turner Ave, Library Town' },
  { id: 'store7', name: 'Fresh Start Bakery & Cafe', email: 'info@freshstartbakery.com', address: '707 Muffin Top St, Sweetville' },
  { id: 'store8', name: 'Adventure Gear Outfitters', email: 'gear@adventure.com', address: '808 Mountain Pass, Summit Peak' },
  { id: 'store9', name: 'Serene Spa & Wellness', email: 'relax@serenespa.com', address: '909 Tranquil Path, Calm Waters' },
  { id: 'store10', name: 'Pawsitively Pets Supplies', email: 'pets@pawsitively.com', address: '1010 Bark Ave, Animal Kingdom' },
  { id: 'store11', name: 'Melody Makers Music Shop', email: 'music@melodymakers.com', address: '1111 Harmony St, Tune Town' },
  { id: 'store12', name: 'Artisan Alley Crafts', email: 'crafts@artisanalley.com', address: '1212 Creative Way, Handcraft City' },
  { id: 'store13', name: 'Gourmet Galaxy Fine Foods', email: 'food@gourmetgalaxy.com', address: '1313 Flavor Trail, Epicuria' },
  { id: 'store14', name: 'Vintage Vogue Boutique', email: 'style@vintagevogue.com', address: '1414 Retro Rd, Fashion Forward' },
  { id: 'store15', name: 'Green Thumb Garden Center', email: 'plants@greenthumb.com', address: '1515 Sprout St, Flora Valley' },
  { id: 'store16', name: 'CyclePro Bike Shop', email: 'bikes@cyclepro.com', address: '1616 Pedal Path, Velocity Ville' },
  { id: 'store17', name: 'Home Harmony Decor', email: 'decor@homeharmony.com', address: '1717 Cozy Ct, Interior City' },
  { id: 'store18', name: 'The Fitness Hub Gym', email: 'fitness@thehub.com', address: '1818 Wellness Way, Strongtown' },
  { id: 'store19', name: 'Global Goods Grocer', email: 'groceries@globalgoods.com', address: '1919 Market Pl, World Food Center' },
  { id: 'store20', name: 'QuickFix Auto Repair', email: 'repair@quickfixauto.com', address: '2020 Wrench Rd, Motorville' },
  { id: 'store21', name: 'The Board Room Cafe (Games)', email: 'games@boardroom.com', address: '2121 Dice Roll Dr, Playville' }
];

export let mockRatings = [
  { id: 'rating1', storeId: 'store1', userId: 'user1', ratingValue: 5, timestamp: Date.now() - 100000 },
  { id: 'rating2', storeId: 'store1', userId: 'admin1', ratingValue: 4, timestamp: Date.now() - 200000 },
  { id: 'rating3', storeId: 'store2', userId: 'user1', ratingValue: 3, timestamp: Date.now() - 50000 },
  { id: 'rating4', storeId: 'store4', userId: 'user1', ratingValue: 4, timestamp: Date.now() - 60000 },
  { id: 'rating5', storeId: 'store5', userId: 'user2', ratingValue: 5, timestamp: Date.now() - 70000 },
  { id: 'rating6', storeId: 'store1', userId: 'user2', ratingValue: 2, timestamp: Date.now() - 80000 },
];

// Note: Users are managed within AuthContext.jsx for this example to simplify state management
// but in a real app, users, stores, and ratings would all be fetched from a backend API.