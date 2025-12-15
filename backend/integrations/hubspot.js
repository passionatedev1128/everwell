import Hubspot from '@hubspot/api-client';

let hubspotClient = null;

const initializeClient = () => {
  // Check for private app token first (preferred method)
  const accessToken = process.env.HUBSPOT_PRIVATE_APP_TOKEN;
  // Fallback to API key for backward compatibility
  const apiKey = process.env.HUBSPOT_API_KEY;

  if (!accessToken && !apiKey) {
    console.warn('⚠️ HUBSPOT_PRIVATE_APP_TOKEN or HUBSPOT_API_KEY not set. HubSpot integration disabled.');
    return null;
  }

  if (!hubspotClient) {
    try {
      // Use private app token if available (preferred), otherwise fall back to API key
      const config = accessToken 
        ? { accessToken } 
        : { apiKey };
      
      hubspotClient = new Hubspot.Client(config);
      console.log('✅ HubSpot client initialized', { method: accessToken ? 'Private App Token' : 'API Key' });
    } catch (error) {
      console.error('❌ Failed to initialize HubSpot client:', error?.message || error);
      hubspotClient = null;
    }
  }

  return hubspotClient;
};

const splitName = (fullName = '') => {
  const parts = fullName.trim().split(' ').filter(Boolean);
  if (parts.length === 0) {
    return { firstName: '', lastName: '' };
  }
  const [firstName, ...rest] = parts;
  return {
    firstName,
    lastName: rest.join(' '),
  };
};

export const sendOrderToHubSpot = async (order, user) => {
  const client = initializeClient();
  if (!client) {
    return;
  }

  if (!user?.email) {
    console.warn('⚠️ HubSpot integration skipped: user email missing');
    return;
  }

  const { firstName, lastName } = splitName(user.name || '');
  const email = user.email.toLowerCase();
  const total = Number(order.totalAmount || 0);

  const properties = {
    email,
    firstname: firstName || user.name || '',
    lastname: lastName,
    phone: user.phone || '',
    order_id: order._id?.toString() || '',
    last_order_total: total.toFixed(2),
    last_order_status: order.status || 'pending',
  };

  try {
    await client.crm.contacts.basicApi.create({ properties });
    console.log(`✅ HubSpot: contact created for ${email}`);
  } catch (error) {
    if (error?.statusCode === 409) {
      try {
        const searchResponse = await client.crm.contacts.searchApi.doSearch({
          filterGroups: [
            {
              filters: [
                {
                  propertyName: 'email',
                  operator: 'EQ',
                  value: email,
                },
              ],
            },
          ],
          limit: 1,
        });

        const existingContact = searchResponse?.results?.[0];
        if (existingContact?.id) {
          await client.crm.contacts.basicApi.update(existingContact.id, { properties });
          console.log(`ℹ️ HubSpot: contact updated for ${email}`);
        } else {
          console.warn(`⚠️ HubSpot: contact conflict but no existing record found for ${email}`);
        }
      } catch (searchError) {
        console.error('❌ HubSpot search/update error:', searchError?.message || searchError);
      }
    } else {
      console.error('❌ HubSpot API error:', error?.message || error);
    }
  }
};

export default {
  sendOrderToHubSpot,
};


