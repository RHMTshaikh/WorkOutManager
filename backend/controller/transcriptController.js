// npm install @google-cloud/vertexai
// gcloud auth application-default login
const {VertexAI} = require('@google-cloud/vertexai');

const analyzeTranscript = async (req, res)=> {

    // Initialize Vertex with your Cloud project and location
    const vertex_ai = new VertexAI({project: `${process.env.VERTEX_AI_API}`, location: 'us-central1'});
        // Instantiate the models
    const generativeModel = vertex_ai.preview.getGenerativeModel({
        model: 'gemini-1.0-pro-002',
        generationConfig: {
        'maxOutputTokens': 30,
        'temperature': 1,
        'topP': 1,
        },
        safetySettings: [
            {   'category': 'HARM_CATEGORY_HATE_SPEECH',
                'threshold': 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {   'category': 'HARM_CATEGORY_DANGEROUS_CONTENT',
                'threshold': 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {   'category': 'HARM_CATEGORY_SEXUALLY_EXPLICIT',
                'threshold': 'BLOCK_MEDIUM_AND_ABOVE'
            },
            {   'category': 'HARM_CATEGORY_HARASSMENT',
                'threshold': 'BLOCK_MEDIUM_AND_ABOVE'
            }
        ],
    });
        
    const prompt = req.body.prompt
    console.log(prompt)

    const request = {
        contents: [{
            role: 'user', 
            parts: 
            [{
                text: `extract these three workout related data from the prompt title, load, and reps and make a json file like this
                {\"title\": \"...\", \"load\":\"...\", \"reps\":\"...\"}
                instructions: 
                only produce the json file and nothing else

                input: create a new work out with 12 reps of situps with Lord 5kg with name of bench_press
                output: { \"title\": \"Pushups\", \"load\": \"1\", \"reps\": \"34\"}

                input: create a new work out with 12 reps of situps with load 5kg 

                output: { \"title\": \"Situps\", \"load\": \"5\", \"reps\": \"12\"}

                input: Can you suggest a core exercise? Maybe some planks with no load and about 60 seconds hold?

                output: { \"title\": \"Planks\", \"load\": \"0\", \"reps\": \"60\"}

                input: ${prompt}
                output:`
            }]
        }],
    };

    try {
        const streamingResp = await generativeModel.generateContentStream(request);

        const response = (await streamingResp.response)

        res.status(200).json(JSON.parse(response.candidates[0].content.parts[0].text))
        
    } catch (error) {
        res.status(400).json({error: error.message})
    }
}
// analyzeTranscript();
module.exports = analyzeTranscript

// npm uninstall browserify buffer crypto-browserify fs https-browserify os-browserify path-browserify polyfills querystring-es3 stream-browserify stream-http