import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env') });

// MongoDB connection strings
const LOCAL_MONGO_URI = process.env.LOCAL_MONGO_URI || 'mongodb://localhost:27017/everwell';
const ATLAS_MONGO_URI = process.env.ATLAS_MONGO_URI || process.env.MONGO_URI;

if (!ATLAS_MONGO_URI) {
  console.error('❌ Error: ATLAS_MONGO_URI or MONGO_URI not found in .env file');
  console.log('Please set ATLAS_MONGO_URI in backend/.env file');
  console.log('Example: ATLAS_MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/everwell');
  process.exit(1);
}

// Collections to migrate
const COLLECTIONS = [
  'users',
  'products',
  'orders',
  'blogs',
  'faqs',
  'bookings',
  'feedback',
  'notifications',
  'auditlogs'
];

async function migrateDatabase() {
  let localClient, atlasClient;
  
  try {
    console.log('🔄 Starting database migration from local MongoDB to MongoDB Atlas...\n');
    
    // Step 1: Connect to local MongoDB
    console.log('📡 Step 1: Connecting to local MongoDB...');
    localClient = new MongoClient(LOCAL_MONGO_URI);
    await localClient.connect();
    console.log(`✅ Connected to local MongoDB: ${LOCAL_MONGO_URI}\n`);
    
    // Step 2: Connect to MongoDB Atlas
    console.log('📡 Step 2: Connecting to MongoDB Atlas...');
    atlasClient = new MongoClient(ATLAS_MONGO_URI);
    await atlasClient.connect();
    console.log(`✅ Connected to MongoDB Atlas\n`);
    
    // Step 3: Get local database
    // Extract database name from URI or use default
    const localDbName = LOCAL_MONGO_URI.split('/').pop().split('?')[0] || 'everwell';
    const localDb = localClient.db(localDbName);
    
    // Step 4: Get Atlas database
    // Extract database name from URI or use default
    const atlasDbName = ATLAS_MONGO_URI.split('/').pop().split('?')[0] || 'everwell';
    const atlasDb = atlasClient.db(atlasDbName);
    
    // Step 5: Migrate each collection
    let totalDocuments = 0;
    
    for (const collectionName of COLLECTIONS) {
      try {
        console.log(`📦 Migrating collection: ${collectionName}...`);
        
        // Check if collection exists in local database
        const localCollections = await localDb.listCollections({ name: collectionName }).toArray();
        
        if (localCollections.length === 0) {
          console.log(`   ⚠️  Collection '${collectionName}' not found in local database, skipping...\n`);
          continue;
        }
        
        // Get all documents from local collection
        const localCollection = localDb.collection(collectionName);
        const documents = await localCollection.find({}).toArray();
        
        if (documents.length === 0) {
          console.log(`   ℹ️  Collection '${collectionName}' is empty, skipping...\n`);
          continue;
        }
        
        console.log(`   📄 Found ${documents.length} document(s)`);
        
        // Check if collection exists in Atlas
        const atlasCollections = await atlasDb.listCollections({ name: collectionName }).toArray();
        const atlasCollection = atlasDb.collection(collectionName);
        
        if (atlasCollections.length > 0) {
          const existingCount = await atlasCollection.countDocuments();
          console.log(`   ⚠️  Collection '${collectionName}' already exists in Atlas with ${existingCount} document(s)`);
          console.log(`   🔄 Options:`);
          console.log(`      1. Skip (keep existing data)`);
          console.log(`      2. Replace (delete existing and insert new)`);
          console.log(`      3. Merge (insert only new documents)`);
          
          // For automated migration, we'll use merge strategy
          // Remove duplicates based on _id
          const existingIds = await atlasCollection.distinct('_id');
          const newDocuments = documents.filter(doc => !existingIds.some(id => id.toString() === doc._id.toString()));
          
          if (newDocuments.length > 0) {
            await atlasCollection.insertMany(newDocuments, { ordered: false });
            console.log(`   ✅ Inserted ${newDocuments.length} new document(s) (skipped ${documents.length - newDocuments.length} duplicates)`);
            totalDocuments += newDocuments.length;
          } else {
            console.log(`   ⏭️  All documents already exist, skipping...`);
          }
        } else {
          // Collection doesn't exist, insert all documents
          await atlasCollection.insertMany(documents, { ordered: false });
          console.log(`   ✅ Inserted ${documents.length} document(s)`);
          totalDocuments += documents.length;
        }
        
        console.log(`   ✅ Collection '${collectionName}' migrated successfully\n`);
        
      } catch (error) {
        console.error(`   ❌ Error migrating collection '${collectionName}':`, error.message);
        console.log(`   ⚠️  Continuing with next collection...\n`);
      }
    }
    
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log(`✅ Migration completed successfully!`);
    console.log(`📊 Total documents migrated: ${totalDocuments}`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log('📝 Next steps:');
    console.log('1. Update your backend/.env file:');
    console.log('   Change MONGO_URI to your Atlas connection string');
    console.log('2. Test the connection by restarting your backend server');
    console.log('3. Verify data in MongoDB Atlas dashboard\n');
    
  } catch (error) {
    console.error('❌ Migration failed:', error);
    throw error;
  } finally {
    // Close connections
    if (localClient) {
      await localClient.close();
      console.log('🔌 Closed local MongoDB connection');
    }
    if (atlasClient) {
      await atlasClient.close();
      console.log('🔌 Closed Atlas MongoDB connection');
    }
  }
}

// Run migration
migrateDatabase()
  .then(() => {
    console.log('🎉 Migration script completed');
    process.exit(0);
  })
  .catch((error) => {
    console.error('💥 Migration script failed:', error);
    process.exit(1);
  });

