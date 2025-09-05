import axios from 'axios';

const PINATA_API_KEY = import.meta.env.VITE_PINATA_API_KEY;
const PINATA_SECRET_API_KEY = import.meta.env.VITE_PINATA_SECRET_API_KEY;
const PINATA_BASE_URL = 'https://api.pinata.cloud';

if (!PINATA_API_KEY || !PINATA_SECRET_API_KEY) {
  console.warn('Pinata API keys missing. IPFS storage features will not work.');
}

const pinataAxios = axios.create({
  baseURL: PINATA_BASE_URL,
  headers: {
    'pinata_api_key': PINATA_API_KEY,
    'pinata_secret_api_key': PINATA_SECRET_API_KEY
  }
});

export const ipfsService = {
  // Pin JSON data to IPFS
  pinJSONToIPFS: async (jsonData, metadata = {}) => {
    try {
      const data = {
        pinataContent: jsonData,
        pinataMetadata: {
          name: metadata.name || 'LegalShield AI Data',
          keyvalues: {
            app: 'legalshield-ai',
            type: metadata.type || 'incident-report',
            timestamp: new Date().toISOString(),
            ...metadata.keyvalues
          }
        },
        pinataOptions: {
          cidVersion: 1
        }
      };

      const response = await pinataAxios.post('/pinning/pinJSONToIPFS', data);
      
      return {
        success: true,
        ipfsHash: response.data.IpfsHash,
        pinSize: response.data.PinSize,
        timestamp: response.data.Timestamp,
        url: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`
      };
    } catch (error) {
      console.error('Error pinning JSON to IPFS:', error);
      throw new Error('Failed to pin data to IPFS');
    }
  },

  // Pin file to IPFS
  pinFileToIPFS: async (file, metadata = {}) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const pinataMetadata = JSON.stringify({
        name: metadata.name || file.name || 'LegalShield AI File',
        keyvalues: {
          app: 'legalshield-ai',
          type: metadata.type || 'audio-recording',
          timestamp: new Date().toISOString(),
          ...metadata.keyvalues
        }
      });
      
      formData.append('pinataMetadata', pinataMetadata);
      
      const pinataOptions = JSON.stringify({
        cidVersion: 1
      });
      
      formData.append('pinataOptions', pinataOptions);

      const response = await pinataAxios.post('/pinning/pinFileToIPFS', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      return {
        success: true,
        ipfsHash: response.data.IpfsHash,
        pinSize: response.data.PinSize,
        timestamp: response.data.Timestamp,
        url: `https://gateway.pinata.cloud/ipfs/${response.data.IpfsHash}`
      };
    } catch (error) {
      console.error('Error pinning file to IPFS:', error);
      throw new Error('Failed to pin file to IPFS');
    }
  },

  // Get pinned data from IPFS
  getPinnedData: async (ipfsHash) => {
    try {
      const response = await axios.get(`https://gateway.pinata.cloud/ipfs/${ipfsHash}`);
      return response.data;
    } catch (error) {
      console.error('Error getting pinned data:', error);
      throw new Error('Failed to retrieve data from IPFS');
    }
  },

  // List pinned files
  getPinnedList: async (filters = {}) => {
    try {
      const params = {
        status: 'pinned',
        pageLimit: filters.limit || 10,
        pageOffset: filters.offset || 0
      };

      if (filters.metadata) {
        params.metadata = filters.metadata;
      }

      const response = await pinataAxios.get('/data/pinList', { params });
      
      return {
        success: true,
        pins: response.data.rows,
        count: response.data.count
      };
    } catch (error) {
      console.error('Error getting pinned list:', error);
      throw new Error('Failed to get pinned files list');
    }
  },

  // Unpin data from IPFS
  unpinFromIPFS: async (ipfsHash) => {
    try {
      await pinataAxios.delete(`/pinning/unpin/${ipfsHash}`);
      return { success: true };
    } catch (error) {
      console.error('Error unpinning from IPFS:', error);
      throw new Error('Failed to unpin from IPFS');
    }
  },

  // Create shareable incident report
  createShareableReport: async (incidentData, audioBlob = null) => {
    try {
      const reportData = {
        ...incidentData,
        createdAt: new Date().toISOString(),
        version: '1.0',
        app: 'LegalShield AI'
      };

      // Pin the incident report JSON
      const jsonResult = await ipfsService.pinJSONToIPFS(reportData, {
        name: `Incident Report - ${incidentData.location || 'Unknown'} - ${new Date().toLocaleDateString()}`,
        type: 'incident-report'
      });

      let audioResult = null;
      if (audioBlob) {
        // Pin the audio file if provided
        const audioFile = new File([audioBlob], 'incident-audio.webm', { type: 'audio/webm' });
        audioResult = await ipfsService.pinFileToIPFS(audioFile, {
          name: `Incident Audio - ${incidentData.location || 'Unknown'} - ${new Date().toLocaleDateString()}`,
          type: 'audio-recording'
        });
      }

      return {
        success: true,
        reportHash: jsonResult.ipfsHash,
        reportUrl: jsonResult.url,
        audioHash: audioResult?.ipfsHash,
        audioUrl: audioResult?.url,
        shareableLink: `${window.location.origin}/shared-report/${jsonResult.ipfsHash}`
      };
    } catch (error) {
      console.error('Error creating shareable report:', error);
      throw new Error('Failed to create shareable report');
    }
  },

  // Test Pinata connection
  testConnection: async () => {
    try {
      const response = await pinataAxios.get('/data/testAuthentication');
      return {
        success: true,
        message: response.data.message
      };
    } catch (error) {
      console.error('Pinata connection test failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
};
