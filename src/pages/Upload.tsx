import { useState, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload as UploadIcon, ChevronRight, ChevronLeft, MapPin, Loader2, ImageIcon, RotateCcw, Navigation, AlertCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { diagnosticQuestions, diseases, calculateSeverity, type Disease } from "@/lib/diseases";
import { analyzeSkinImage } from "@/lib/skinDetector";

interface DermatologyClinic {
  name: string;
  address: string;
  specialty: string;
}

const hospitalData: Record<string, DermatologyClinic[]> = {
  delhi: [
    { name: "Dr. Deepali Bhardwaj's Skin Clinic", address: "C-7, Vasant Vihar, New Delhi", specialty: "Dermatology" },
    { name: "Skin & Hair Factory", address: "M-12, Greater Kailash Part 1, New Delhi", specialty: "Skin Care" },
    { name: "DermaWorld Skin & Hair Clinics", address: "A-3, Green Park Main, New Delhi", specialty: "Cosmetic Dermatology" },
    { name: "ILAMED Skin Clinic", address: "B-1/24, Rajouri Garden, New Delhi", specialty: "Dermatology" },
    { name: "Dr. Simal Soin's AAYNA Clinic", address: "A-1, Hauz Khas Enclave, New Delhi", specialty: "Cosmetic Dermatology" },
    { name: "Derma Miracle Clinic", address: "D-45, South Extension Part 2, New Delhi", specialty: "Skin Care" },
    { name: "SkinQure Clinic", address: "E-2250, Palam Vihar, Gurgaon Road, New Delhi", specialty: "Dermatology" },
    { name: "Clinic Dermatech", address: "F-4, East of Kailash, New Delhi", specialty: "Cosmetic Dermatology" },
    { name: "Dr. A's Clinic", address: "N-29, Panchsheel Park, New Delhi", specialty: "Dermatology" },
    { name: "AKS Skin & Hair Clinic", address: "H-5, Connaught Place, New Delhi", specialty: "Skin Care" },
  ],
  mumbai: [
    { name: "Dr. Niketa Sonavane's Ambrosia Clinic", address: "101, Shreeji Plaza, Andheri West, Mumbai", specialty: "Cosmetic Dermatology" },
    { name: "The Esthetic Clinics", address: "15th Floor, Hubtown Solaris, Andheri East, Mumbai", specialty: "Dermatology" },
    { name: "Skinfiniti Aesthetic & Laser Clinic", address: "102, Shree Siddhivinayak Tower, Dadar West, Mumbai", specialty: "Skin Care" },
    { name: "Clear Skin Clinic", address: "301, Linking Road, Bandra West, Mumbai", specialty: "Dermatology" },
    { name: "Dr. Rinky Kapoor's The Esthetic Clinics", address: "7th Floor, Kohinoor City, Kurla West, Mumbai", specialty: "Cosmetic Dermatology" },
    { name: "Kaya Skin Clinic", address: "201, Pali Hill, Bandra West, Mumbai", specialty: "Skin Care" },
    { name: "Body Craft Skin Clinic", address: "Ground Floor, Hill Road, Bandra West, Mumbai", specialty: "Dermatology" },
    { name: "Dr. Geeta Fazalbhoy Skin Clinic", address: "5th Floor, Breach Candy Hospital Trust, Mumbai", specialty: "Dermatology" },
    { name: "Sakhiya Skin Clinic", address: "B-12, Borivali West, Mumbai", specialty: "Cosmetic Dermatology" },
    { name: "AK Clinics", address: "402, Juhu Tara Road, Juhu, Mumbai", specialty: "Skin Care" },
  ],
  chennai: [
    { name: "Dr. Abirami's Skin & Hair Clinic", address: "No. 5, TTK Road, Alwarpet, Chennai", specialty: "Dermatology" },
    { name: "FMS Skin & Hair Clinic", address: "No. 12, Anna Nagar East, Chennai", specialty: "Cosmetic Dermatology" },
    { name: "Oliva Skin & Hair Clinic", address: "3rd Floor, Nungambakkam High Road, Chennai", specialty: "Skin Care" },
    { name: "Dr. Sethuraman's Skin Clinic", address: "No. 45, Mylapore, Chennai", specialty: "Dermatology" },
    { name: "Aura Skin & Hair Clinic", address: "No. 22, Velachery Main Road, Chennai", specialty: "Cosmetic Dermatology" },
    { name: "Chennai Skin Foundation", address: "No. 8, T Nagar, Chennai", specialty: "Dermatology" },
    { name: "Dr. Ravi's Skin Care Centre", address: "No. 3, Adyar, Chennai", specialty: "Skin Care" },
    { name: "Raj Skin & Hair Clinic", address: "No. 18, Kilpauk, Chennai", specialty: "Dermatology" },
    { name: "VCare Skin Clinic", address: "No. 7, Tambaram, Chennai", specialty: "Cosmetic Dermatology" },
    { name: "Derma Care Clinic", address: "No. 14, Porur, Chennai", specialty: "Skin Care" },
  ],
  coimbatore: [
    { name: "Dr. Srinivas Skin Clinic", address: "RS Puram, Coimbatore", specialty: "Dermatology" },
    { name: "Kaya Skin Clinic Coimbatore", address: "Race Course Road, Coimbatore", specialty: "Skin Care" },
    { name: "Oliva Skin & Hair Clinic", address: "Avinashi Road, Peelamedu, Coimbatore", specialty: "Cosmetic Dermatology" },
    { name: "Dr. Revathi's Skin Care", address: "Gandhipuram, Coimbatore", specialty: "Dermatology" },
    { name: "Radiance Skin Clinic", address: "Saibaba Colony, Coimbatore", specialty: "Skin Care" },
    { name: "SkinSpace Clinic", address: "Hopes College Junction, Coimbatore", specialty: "Cosmetic Dermatology" },
    { name: "Dr. Meena's Derma Clinic", address: "Town Hall, Coimbatore", specialty: "Dermatology" },
    { name: "Cutis Skin Clinic", address: "Singanallur, Coimbatore", specialty: "Skin Care" },
    { name: "Glow Skin Care Centre", address: "Brookefields, Coimbatore", specialty: "Cosmetic Dermatology" },
    { name: "DermaCare Speciality Clinic", address: "Tatabad, Coimbatore", specialty: "Dermatology" },
  ],
};

const detectCity = (lat: number, lon: number): string | null => {
  if (lat >= 28.4 && lat <= 28.9 && lon >= 76.8 && lon <= 77.5) return "delhi";
  if (lat >= 18.8 && lat <= 19.3 && lon >= 72.7 && lon <= 73.1) return "mumbai";
  if (lat >= 12.9 && lat <= 13.3 && lon >= 80.1 && lon <= 80.4) return "chennai";
  if (lat >= 10.9 && lat <= 11.1 && lon >= 76.9 && lon <= 77.1) return "coimbatore";
  return null;
};

type Step = "upload" | "analyzing" | "questions" | "results";

const Upload = () => {
  const [step, setStep] = useState<Step>("upload");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Record<number, boolean>>({});
  const [currentQ, setCurrentQ] = useState(0);
  const [detectedDisease, setDetectedDisease] = useState<Disease | null>(null);
  const [clinics, setClinics] = useState<DermatologyClinic[]>([]);
  const [detectedCity, setDetectedCity] = useState<string | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [loadingLocation, setLoadingLocation] = useState(false);
  const [cityInput, setCityInput] = useState("");
  const [citySearchError, setCitySearchError] = useState<string | null>(null);
  const [skinAnalysisError, setSkinAnalysisError] = useState<string | null>(null);
  const [skinConfidence, setSkinConfidence] = useState<number | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const ALLOWED_TYPES = ["image/png", "image/jpg", "image/jpeg"];
  const ALLOWED_EXT = [".png", ".jpg", ".jpeg"];
  const [fileError, setFileError] = useState<string | null>(null);

  const validateFile = (file: File): boolean => {
    const ext = file.name.toLowerCase().slice(file.name.lastIndexOf("."));
    if (!ALLOWED_TYPES.includes(file.type) && !ALLOWED_EXT.includes(ext)) {
      setFileError("Invalid file format. Only PNG and JPG images are allowed.");
      return false;
    }
    setFileError(null);
    return true;
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && validateFile(file)) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && validateFile(file)) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  }, []);

  const proceedToQuestions = async () => {
    if (!imageFile || !imagePreview) return;
    setSkinAnalysisError(null);
    setAnalyzing(true);
    setStep("analyzing");

    try {
      const result = await analyzeSkinImage(imagePreview);
      setSkinConfidence(result.confidence);

      if (result.isSkinImage) {
        setStep("questions");
      } else {
        setSkinAnalysisError(result.message);
        setStep("upload");
      }
    } catch {
      setSkinAnalysisError("Unable to process image. Please try another image.");
      setStep("upload");
    } finally {
      setAnalyzing(false);
    }
  };

  const handleAnswer = (qId: number, value: boolean) => {
    setAnswers((prev) => ({ ...prev, [qId]: value }));
  };

  const finishQuestions = () => {
    const yesCount = Object.values(answers).filter(Boolean).length;
    const idx = yesCount % diseases.length;
    setDetectedDisease(diseases[idx]);
    setStep("results");
  };

  const handleUseLocation = () => {
    setLocationError(null);
    setClinics([]);
    setDetectedCity(null);
    setCitySearchError(null);

    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    setLoadingLocation(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const city = detectCity(latitude, longitude);
        if (city) {
          setDetectedCity(city);
          setClinics(hospitalData[city]);
        } else {
          setLocationError("No dermatology clinics found in this region.");
        }
        setLoadingLocation(false);
      },
      (error) => {
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError("Location access denied. Please enter your city manually.");
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError("Location information is unavailable.");
            break;
          case error.TIMEOUT:
            setLocationError("Location request timed out. Please try again.");
            break;
          default:
            setLocationError("An unknown error occurred while fetching location.");
        }
        setLoadingLocation(false);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleCitySearch = () => {
    setCitySearchError(null);
    setLocationError(null);
    setClinics([]);
    setDetectedCity(null);

    const trimmed = cityInput.trim();
    if (!trimmed) {
      setCitySearchError("Please enter a valid city.");
      return;
    }

    const key = trimmed.toLowerCase();
    if (hospitalData[key]) {
      setDetectedCity(key);
      setClinics(hospitalData[key]);
    } else {
      setCitySearchError("No dermatology clinics found in this region.");
    }
  };

  const yesCount = Object.values(answers).filter(Boolean).length;
  const severity = calculateSeverity(yesCount);
  const allAnswered = Object.keys(answers).length === diagnosticQuestions.length;

  const reset = () => {
    setStep("upload");
    setImageFile(null);
    setImagePreview(null);
    setAnswers({});
    setCurrentQ(0);
    setDetectedDisease(null);
    setClinics([]);
    setDetectedCity(null);
    setLocationError(null);
    setCityInput("");
    setCitySearchError(null);
    setSkinAnalysisError(null);
    setSkinConfidence(null);
    setAnalyzing(false);
  };

  return (
    <div className="min-h-screen py-10">
      <div className="container mx-auto px-4 max-w-2xl">
        {/* Progress */}
        <div className="flex items-center justify-center gap-2 mb-8">
          {(["upload", "analyzing", "questions", "results"] as Step[]).map((s, i) => {
            // Map analyzing to same visual position as upload (step 1)
            const visualIndex = s === "analyzing" ? 0 : s === "upload" ? 0 : s === "questions" ? 1 : 2;
            if (s === "analyzing") return null; // Don't show separate dot for analyzing
            return (
            <div key={s} className="flex items-center gap-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                  step === s || (s === "upload" && step === "analyzing") ? "bg-primary text-primary-foreground" :
                  (["upload", "analyzing", "questions", "results"].indexOf(step) > ["upload", "analyzing", "questions", "results"].indexOf(s) ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground")
                }`}
              >
                {visualIndex + 1}
              </div>
              {visualIndex < 2 && <div className="w-8 h-px bg-border" />}
            </div>
          );
          })}
        </div>

        <AnimatePresence mode="wait">
          {/* STEP 1: Upload */}
          {step === "upload" && (
            <motion.div key="upload" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UploadIcon className="h-5 w-5 text-primary" />
                    Upload Skin Image
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    onDragOver={(e) => e.preventDefault()}
                    onDrop={handleDrop}
                    className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                    onClick={() => document.getElementById("file-input")?.click()}
                  >
                    {imagePreview ? (
                      <img src={imagePreview} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
                    ) : (
                      <div className="space-y-2">
                        <ImageIcon className="h-12 w-12 mx-auto text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Drag & drop or click to upload an image</p>
                        <p className="text-xs text-muted-foreground">Supports JPG, PNG, WEBP</p>
                      </div>
                    )}
                    <input
                      id="file-input"
                      type="file"
                      accept=".png,.jpg,.jpeg"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </div>
                  {fileError && (
                    <Alert variant="destructive" className="mt-3">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{fileError}</AlertDescription>
                    </Alert>
                  )}
                  {skinAnalysisError && (
                    <Alert variant="destructive" className="mt-3">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{skinAnalysisError}</AlertDescription>
                    </Alert>
                  )}
                  <Button className="w-full mt-4 gap-2" disabled={!imageFile || analyzing} onClick={proceedToQuestions}>
                    {analyzing ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Analyzing Image...
                      </>
                    ) : (
                      <>
                        Continue to Diagnostic Questions <ChevronRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* STEP: Analyzing overlay */}
          {step === "analyzing" && (
            <motion.div key="analyzing" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <Card>
                <CardContent className="py-16">
                  <div className="text-center space-y-4">
                    <Loader2 className="h-12 w-12 animate-spin mx-auto text-primary" />
                    <h3 className="text-lg font-semibold">Analyzing Your Image</h3>
                    <p className="text-sm text-muted-foreground">
                      Checking if the uploaded image contains detectable skin regions...
                    </p>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* STEP 2: Questions */}
          {step === "questions" && (
            <motion.div key="questions" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <Card>
                <CardHeader>
                  <CardTitle>Diagnostic Questions ({Object.keys(answers).length}/{diagnosticQuestions.length})</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-bold">
                        {currentQ + 1}
                      </span>
                      <p className="font-medium text-sm pt-1">{diagnosticQuestions[currentQ].question}</p>
                    </div>
                    <RadioGroup
                      value={answers[diagnosticQuestions[currentQ].id] === undefined ? undefined : answers[diagnosticQuestions[currentQ].id] ? "yes" : "no"}
                      onValueChange={(v) => handleAnswer(diagnosticQuestions[currentQ].id, v === "yes")}
                      className="flex gap-4 pl-10"
                    >
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="yes" id="yes" />
                        <Label htmlFor="yes">Yes</Label>
                      </div>
                      <div className="flex items-center gap-2">
                        <RadioGroupItem value="no" id="no" />
                        <Label htmlFor="no">No</Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Navigation */}
                  <div className="flex justify-between pt-4">
                    <Button
                      variant="outline"
                      size="sm"
                      disabled={currentQ === 0}
                      onClick={() => setCurrentQ((p) => p - 1)}
                    >
                      <ChevronLeft className="h-4 w-4 mr-1" /> Previous
                    </Button>
                    {currentQ < diagnosticQuestions.length - 1 ? (
                      <Button
                        size="sm"
                        disabled={answers[diagnosticQuestions[currentQ].id] === undefined}
                        onClick={() => setCurrentQ((p) => p + 1)}
                      >
                        Next <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    ) : (
                      <Button size="sm" disabled={!allAnswered} onClick={finishQuestions}>
                        Get Results <ChevronRight className="h-4 w-4 ml-1" />
                      </Button>
                    )}
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-muted rounded-full h-1.5">
                    <div
                      className="bg-primary h-1.5 rounded-full transition-all"
                      style={{ width: `${(Object.keys(answers).length / diagnosticQuestions.length) * 100}%` }}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* STEP 3: Results */}
          {step === "results" && detectedDisease && (
            <motion.div key="results" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
              {/* Detection result */}
              <Card>
                <CardHeader>
                  <CardTitle>Detection Results</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {imagePreview && (
                    <img src={imagePreview} alt="Uploaded" className="max-h-40 rounded-lg mx-auto" />
                  )}
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Possible Condition</p>
                    <h2 className="text-2xl font-bold text-primary">{detectedDisease.name}</h2>
                    <span className="inline-block mt-1 text-xs uppercase font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                      {detectedDisease.category}
                    </span>
                    <p className="text-sm text-muted-foreground mt-3">{detectedDisease.description}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Severity */}
              <Card>
                <CardContent className="pt-6">
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground mb-1">Severity Assessment</p>
                    <p className={`text-3xl font-bold ${severity.color}`}>{severity.level}</p>
                    <p className="text-xs text-muted-foreground mt-1">{yesCount}/10 symptoms reported</p>
                    <p className="text-sm text-muted-foreground mt-3">{severity.description}</p>
                  </div>
                </CardContent>
              </Card>

              {/* Dermatology Clinic Locator */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    Find Nearby Dermatology Clinics
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Use Location Button */}
                  <Button
                    className="w-full gap-2"
                    onClick={handleUseLocation}
                    disabled={loadingLocation}
                  >
                    {loadingLocation ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Navigation className="h-4 w-4" />
                    )}
                    Use My Current Location
                  </Button>

                  {/* OR Separator */}
                  <div className="flex items-center gap-3">
                    <div className="flex-1 h-px bg-border" />
                    <span className="text-xs text-muted-foreground font-medium">OR</span>
                    <div className="flex-1 h-px bg-border" />
                  </div>

                  {/* Manual City Search */}
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter Your City"
                      value={cityInput}
                      onChange={(e) => setCityInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && handleCitySearch()}
                      className="flex-1"
                    />
                    <Button onClick={handleCitySearch} variant="secondary" className="gap-2">
                      <Search className="h-4 w-4" />
                      Search
                    </Button>
                  </div>

                  {/* Error Messages */}
                  {locationError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{locationError}</AlertDescription>
                    </Alert>
                  )}

                  {citySearchError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{citySearchError}</AlertDescription>
                    </Alert>
                  )}

                  {/* Results */}
                  {detectedCity && clinics.length > 0 && (
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-primary capitalize">
                        Dermatology Clinics in {detectedCity} ({clinics.length})
                      </p>
                      {clinics.map((clinic, i) => (
                        <div key={i} className="p-3 rounded-lg bg-muted/50 border space-y-1">
                          <p className="text-sm font-medium">{clinic.name}</p>
                          <p className="text-xs text-muted-foreground">{clinic.address}</p>
                          <span className="inline-block text-[10px] font-semibold uppercase px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                            {clinic.specialty}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Button variant="outline" className="w-full gap-2" onClick={reset}>
                <RotateCcw className="h-4 w-4" /> Start New Detection
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Upload;
