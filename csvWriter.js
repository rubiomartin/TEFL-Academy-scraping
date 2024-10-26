const createCsvWriter = require('csv-writer').createObjectCsvWriter;

// Function to write data to a CSV file
const writeDataToCSV = async (data, filePath) => {
    const csvWriter = createCsvWriter({
        path: filePath,
        header: [
            { id: 'dateFarmed', title: 'Date Farmed' },
            { id: 'source', title: 'Source' },
            { id: 'scrapedURL', title: 'Scraped URL' },
            { id: 'leadStatus', title: 'Lead Status' },
            { id: 'dealStage', title: 'Deal Stage' },
            { id: 'farmer', title: 'Farmer' },
            { id: 'cleaner', title: 'Cleaner' },
            { id: 'approver', title: 'Approver' },
            { id: 'leadGenFunnel', title: 'Lead Gen Funnel' },
            { id: 'userType', title: 'User Type' },
            { id: 'category', title: 'Category' },
            { id: 'subCategory', title: 'Sub Category' },
            { id: 'postDate', title: 'Post Date' },
            { id: 'featJob', title: 'Feat Job' },
            { id: 'jobTitle', title: 'Job Title' },
            { id: 'online', title: 'Online' },
            { id: 'jobType', title: 'Job Type' },
            { id: 'description', title: 'Description' },
            { id: 'studentCategory', title: 'Student Category' },
            { id: 'subject', title: 'Subject' },
            { id: 'salary', title: 'Salary' },
            { id: 'currency', title: 'Currency' },
            { id: 'requirements', title: 'Requirements' },
            { id: 'benefits', title: 'Benefits' },
            { id: 'address', title: 'Address' },
            { id: 'city', title: 'City' },
            { id: 'stateProvince', title: 'State/Province' },
            { id: 'country', title: 'Country' },
            { id: 'region', title: 'Region' },
            { id: 'businessName', title: 'Business Name' },
            { id: 'buDescription', title: 'Bussines Description' },
            { id: 'website', title: 'Website' },
            { id: 'email', title: 'Email' },
            { id: 'phone', title: 'Phone' },
            { id: 'buCountry', title: 'buCountry' },
            { id: 'buregion', title: 'BuRegion' },
            { id: 'firstName', title: 'First name' },
            { id: 'lastName', title: 'Last name' },
            { id: 'BujobTitle', title: 'Bu Job title' },
            { id: 'linkedin', title: 'Linkedin' },
            { id: 'contactEmail', title: 'Contact email' },
            { id: 'buCountry2', title: 'BuCountry2' },
            { id: 'buRegion', title: 'BuRegion' },
            { id: 'instagram', title: 'Instagram' },
            { id: 'facebook', title: 'Facebook' },
            { id: 'twitter', title: 'X (twitter)' },
            { id: 'tiktok', title: 'TikTok' },
            { id: 'youtube', title: 'Youtube' },
            { id: 'socialsLinkedin', title: 'Socials LinkedIn' },
            { id: 'whatsapp', title: 'WhatsApp' },
            { id: 'wechat', title: 'WeChat' },
            { id: 'line', title: 'Line' },
            { id: 'kakaotalk', title: 'Kakao talk' }

        ]
    });

    // Map over the job data to create a records array with formatted data
    const records = data.map(job => {
        const today = new Date();                                   // Get today's date and format it as DD/MM/YY
        const day = String(today.getDate()).padStart(2, '0');
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const year = String(today.getFullYear()).slice(-2);
    
        return {
            ...job,
            dateFarmed: `${day}/${month}/${year}`,
            source: 'The TELF Academy',
            scrapedURL: job.link,
            leadStatus: 'New Lead',
            dealStage: 'Opportunity',
            farmer: 'Juan',
            cleaner: 'Juan',
            approver: 'Lara',
            leadGenFunnel: 'Scraping',
            userType: 'EDU Business',
            category: 'EDU Jobs',
            subCategory: 'Other',
            postDate: job.postDated,
            featJob: 'true',
            jobTitle: job.jobTitle,
            online: '',
            jobType: job.jobType,
            description: job.description,
            studentCategory: '',
            subject: '',
            salary: job.salary, 
            currency: '', 
            requirements: job.requirements, 
            benefits: job.benefits, 
            address: '', 
            city: job.city,
            stateProvince: '',
            country: job.country,
            region: 'Middle East',
            businessName: job.businessName,
            website: job.website
        };
    });
    
    // Try to write the records to the CSV file
    try {
        await csvWriter.writeRecords(records);
        console.log('Data saved to jobsData.csv');
    } catch (error) {
        console.error('Error writing the CSV file:', error);
    }
    
};

module.exports = writeDataToCSV;
