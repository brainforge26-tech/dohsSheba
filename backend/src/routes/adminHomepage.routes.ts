import { Router } from 'express';
import {
  getAdminHeroSlides,
  createHeroSlide,
  updateHeroSlide,
  deleteHeroSlide,
  getAdminPromoCards,
  createPromoCard,
  updatePromoCard,
  deletePromoCard,
  getAdminShortcuts,
  createShortcut,
  updateShortcut,
  deleteShortcut,
  getAdminLocations,
  createLocation,
  updateLocation,
  deleteLocation,
} from '../controllers/adminHomepage.controller';

const router = Router();

// Hero Slides
router.get('/hero-slides', getAdminHeroSlides);
router.post('/hero-slides', createHeroSlide);
router.put('/hero-slides/:id', updateHeroSlide);
router.delete('/hero-slides/:id', deleteHeroSlide);

// Promo Cards
router.get('/promo-cards', getAdminPromoCards);
router.post('/promo-cards', createPromoCard);
router.put('/promo-cards/:id', updatePromoCard);
router.delete('/promo-cards/:id', deletePromoCard);

// Shortcuts
router.get('/shortcuts', getAdminShortcuts);
router.post('/shortcuts', createShortcut);
router.put('/shortcuts/:id', updateShortcut);
router.delete('/shortcuts/:id', deleteShortcut);

// Locations
router.get('/locations', getAdminLocations);
router.post('/locations', createLocation);
router.put('/locations/:id', updateLocation);
router.delete('/locations/:id', deleteLocation);

export default router;
