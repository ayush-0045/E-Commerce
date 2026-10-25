/**
 * Applied AI/ML Recommendation & Vector Similarity Engine
 * Designed for Gahana Luxury Jewelry
 * Computes cosine similarity across multi-dimensional product attribute vectors
 */

// Categorical feature weight mappings
const METAL_WEIGHTS = {
  'Gold': 1.0,
  'Platinum': 1.5,
  'Silver': 0.5,
  'Other': 0.2
};

const PURITY_WEIGHTS = {
  '24K': 1.0,
  '22K': 0.916,
  '18K': 0.75,
  '14K': 0.585,
  '92.5': 0.925
};

const GEMSTONE_WEIGHTS = {
  'Diamond': 2.0,
  'Sapphire': 1.5,
  'Ruby': 1.5,
  'Emerald': 1.5,
  'Pearl': 1.0,
  'None': 0.0
};

const CATEGORY_WEIGHTS = {
  'Rings': 1,
  'Necklaces': 2,
  'Earrings': 3,
  'Bracelets': 4,
  'Bangles': 5,
  'Mangalsutras': 6
};

/**
 * Extracts a normalized N-dimensional feature embedding vector from a jewelry product
 * @param {Object} product - Product model instance
 * @returns {Array<number>} Normalized feature vector
 */
export const extractFeatureVector = (product) => {
  const metalVal = METAL_WEIGHTS[product.metalType] || 0.8;
  const purityVal = PURITY_WEIGHTS[product.metalPurity] || 0.75;
  const gemVal = GEMSTONE_WEIGHTS[product.gemstoneType] || 0.0;
  const catVal = (CATEGORY_WEIGHTS[product.category] || 1) / 10.0;
  
  // Normalized price log-scale
  const priceVal = Math.log10(Math.max(product.price || 1000, 1000)) / 6.0;
  
  // Normalized weight (0 to 50 grams scale)
  const weightVal = Math.min((product.weight || 5) / 50.0, 1.0);

  const rawVector = [metalVal, purityVal, gemVal, catVal, priceVal, weightVal];

  // L2 Vector Normalization
  const magnitude = Math.sqrt(rawVector.reduce((acc, val) => acc + (val * val), 0)) || 1.0;
  return rawVector.map(val => Number((val / magnitude).toFixed(5)));
};

/**
 * Calculates Cosine Similarity between two L2 normalized feature vectors
 * @param {Array<number>} vecA 
 * @param {Array<number>} vecB 
 * @returns {number} Score between 0.0 and 1.0
 */
export const computeCosineSimilarity = (vecA, vecB) => {
  if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
  let dotProduct = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
  }
  return Number(Math.max(0, Math.min(1, dotProduct)).toFixed(4));
};

/**
 * Finds Top-K Visually & Structurally Similar Jewelry Items
 * @param {Object} targetProduct - The product currently viewed by customer
 * @param {Array<Object>} catalog - Full product inventory
 * @param {number} topK - Number of recommendations to return
 * @returns {Array<Object>} Ranked similar products with similarity scores
 */
export const findSimilarProducts = (targetProduct, catalog, topK = 4) => {
  if (!targetProduct || !catalog || catalog.length === 0) return [];

  const targetVector = extractFeatureVector(targetProduct);
  const targetId = (targetProduct._id || targetProduct.id).toString();

  const scoredCatalog = catalog
    .filter(item => (item._id || item.id).toString() !== targetId)
    .map(item => {
      const itemVector = extractFeatureVector(item);
      const similarityScore = computeCosineSimilarity(targetVector, itemVector);
      return {
        ...item,
        similarityScore,
        confidencePercent: Math.round(similarityScore * 100)
      };
    })
    .sort((a, b) => b.similarityScore - a.similarityScore);

  return scoredCatalog.slice(0, topK);
};

export default {
  extractFeatureVector,
  computeCosineSimilarity,
  findSimilarProducts
};
