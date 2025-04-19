"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Progress } from "@/components/ui/progress"
import { Upload, Building, Palette, FileText, Leaf, Check, ArrowRight } from "lucide-react"
import { TokenizationScene } from "@/components/tokenization-scene"
import { Badge } from "@/components/ui/badge"

export function TokenizationInterface() {
  const [step, setStep] = useState(1)
  const [assetType, setAssetType] = useState("property")
  const [assetValue, setAssetValue] = useState(100000)
  const [tokenizationPercent, setTokenizationPercent] = useState(50)
  const [uploadProgress, setUploadProgress] = useState(0)

  // Prevent automatic API calls that might be causing the error
  const safelyFetchData = async (url: string) => {
    try {
      const response = await fetch(url)
      // Check if the response is JSON before parsing
      const contentType = response.headers.get("content-type")
      if (contentType && contentType.includes("application/json")) {
        return await response.json()
      } else {
        console.error("Received non-JSON response:", await response.text())
        return null
      }
    } catch (error) {
      console.error("Error fetching data:", error)
      return null
    }
  }

  // Replace the handleNextStep function with this updated version
  const handleNextStep = () => {
    if (step < 4) {
      setStep(step + 1)
      if (step === 2) {
        // Simulate document upload progress without making actual API calls
        setUploadProgress(0)
        const interval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 100) {
              clearInterval(interval)
              return 100
            }
            return prev + 5
          })
        }, 200)
      }
    }
  }

  const handlePrevStep = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const tokenizedValue = (assetValue * tokenizationPercent) / 100

  const assetTypeIcons = {
    property: <Building className="size-5" />,
    art: <Palette className="size-5" />,
    intellectual: <FileText className="size-5" />,
    environmental: <Leaf className="size-5" />,
  }

  return (
    <div className="container py-8">
      <div className="mb-8 text-center">
        <Badge className="mb-2 bg-primary/20 text-primary hover:bg-primary/20">Asset Tokenization</Badge>
        <h1 className="font-space text-3xl font-bold md:text-4xl">Tokenize Your Assets</h1>
        <p className="mt-2 text-slate-400">Transform real-world value into digital tokens</p>
      </div>

      <div className="grid gap-8 md:grid-cols-1 max-w-[40vw] mx-auto">
        <div>
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Tokenization Process</CardTitle>
                <div className="flex items-center gap-2 rounded-full bg-blue-900/30 px-3 py-1 text-sm font-medium text-blue-400">
                  Step {step} of 4
                </div>
              </div>
              <CardDescription className="text-slate-400">
                {step === 1 && "Select the type of asset you want to tokenize"}
                {step === 2 && "Upload verification documents for your asset"}
                {step === 3 && "Set tokenization parameters and value"}
                {step === 4 && "Review and confirm your tokenization"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <Progress value={step * 25} className="h-2 bg-secondary">
                  <div className="h-full bg-primary" />
                </Progress>
              </div>

              {/* Step 1: Asset Type Selection */}
              {step === 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Tabs defaultValue="property" onValueChange={setAssetType} className="text-white">
                    <TabsList className="grid w-full grid-cols-4 bg-muted">
                      <TabsTrigger
                        value="property"
                        className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                      >
                        Property
                      </TabsTrigger>
                      <TabsTrigger
                        value="art"
                        className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                      >
                        Art
                      </TabsTrigger>
                      <TabsTrigger
                        value="intellectual"
                        className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                      >
                        IP
                      </TabsTrigger>
                      <TabsTrigger
                        value="environmental"
                        className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                      >
                        Environmental
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="property" className="mt-4 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="property-type" className="text-slate-300">
                          Property Type
                        </Label>
                        <Select defaultValue="residential">
                          <SelectTrigger id="property-type" className="border-slate-700 bg-slate-800 text-white">
                            <SelectValue placeholder="Select property type" />
                          </SelectTrigger>
                          <SelectContent className="border-slate-700 bg-slate-800 text-white">
                            <SelectItem value="residential">Residential</SelectItem>
                            <SelectItem value="commercial">Commercial</SelectItem>
                            <SelectItem value="industrial">Industrial</SelectItem>
                            <SelectItem value="land">Land</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="property-address" className="text-slate-300">
                          Property Address
                        </Label>
                        <Input
                          id="property-address"
                          placeholder="Enter the property address"
                          className="border-slate-700 bg-slate-800 text-white placeholder:text-slate-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="property-value" className="text-slate-300">
                          Estimated Value ($)
                        </Label>
                        <Input
                          id="property-value"
                          type="number"
                          value={assetValue}
                          onChange={(e) => setAssetValue(Number(e.target.value))}
                          className="border-slate-700 bg-slate-800 text-white placeholder:text-slate-500"
                        />
                      </div>
                    </TabsContent>
                    <TabsContent value="art" className="mt-4 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="art-type" className="text-slate-300">
                          Art Type
                        </Label>
                        <Select defaultValue="painting">
                          <SelectTrigger id="art-type" className="border-slate-700 bg-slate-800 text-white">
                            <SelectValue placeholder="Select art type" />
                          </SelectTrigger>
                          <SelectContent className="border-slate-700 bg-slate-800 text-white">
                            <SelectItem value="painting">Painting</SelectItem>
                            <SelectItem value="sculpture">Sculpture</SelectItem>
                            <SelectItem value="digital">Digital Art</SelectItem>
                            <SelectItem value="collectible">Collectible</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="art-title" className="text-slate-300">
                          Title/Name
                        </Label>
                        <Input
                          id="art-title"
                          placeholder="Enter the art title"
                          className="border-slate-700 bg-slate-800 text-white placeholder:text-slate-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="art-value" className="text-slate-300">
                          Estimated Value ($)
                        </Label>
                        <Input
                          id="art-value"
                          type="number"
                          value={assetValue}
                          onChange={(e) => setAssetValue(Number(e.target.value))}
                          className="border-slate-700 bg-slate-800 text-white placeholder:text-slate-500"
                        />
                      </div>
                    </TabsContent>
                    <TabsContent value="intellectual" className="mt-4 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="ip-type" className="text-slate-300">
                          IP Type
                        </Label>
                        <Select defaultValue="patent">
                          <SelectTrigger id="ip-type" className="border-slate-700 bg-slate-800 text-white">
                            <SelectValue placeholder="Select IP type" />
                          </SelectTrigger>
                          <SelectContent className="border-slate-700 bg-slate-800 text-white">
                            <SelectItem value="patent">Patent</SelectItem>
                            <SelectItem value="copyright">Copyright</SelectItem>
                            <SelectItem value="trademark">Trademark</SelectItem>
                            <SelectItem value="license">License</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ip-title" className="text-slate-300">
                          Title/Name
                        </Label>
                        <Input
                          id="ip-title"
                          placeholder="Enter the IP title"
                          className="border-slate-700 bg-slate-800 text-white placeholder:text-slate-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="ip-value" className="text-slate-300">
                          Estimated Value ($)
                        </Label>
                        <Input
                          id="ip-value"
                          type="number"
                          value={assetValue}
                          onChange={(e) => setAssetValue(Number(e.target.value))}
                          className="border-slate-700 bg-slate-800 text-white placeholder:text-slate-500"
                        />
                      </div>
                    </TabsContent>
                    <TabsContent value="environmental" className="mt-4 space-y-4">
                      <div className="space-y-2">
                        <Label htmlFor="env-type" className="text-slate-300">
                          Environmental Asset Type
                        </Label>
                        <Select defaultValue="carbon">
                          <SelectTrigger id="env-type" className="border-slate-700 bg-slate-800 text-white">
                            <SelectValue placeholder="Select environmental asset type" />
                          </SelectTrigger>
                          <SelectContent className="border-slate-700 bg-slate-800 text-white">
                            <SelectItem value="carbon">Carbon Credits</SelectItem>
                            <SelectItem value="renewable">Renewable Energy</SelectItem>
                            <SelectItem value="water">Water Rights</SelectItem>
                            <SelectItem value="conservation">Conservation Land</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="env-location" className="text-slate-300">
                          Location
                        </Label>
                        <Input
                          id="env-location"
                          placeholder="Enter the location"
                          className="border-slate-700 bg-slate-800 text-white placeholder:text-slate-500"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="env-value" className="text-slate-300">
                          Estimated Value ($)
                        </Label>
                        <Input
                          id="env-value"
                          type="number"
                          value={assetValue}
                          onChange={(e) => setAssetValue(Number(e.target.value))}
                          className="border-slate-700 bg-slate-800 text-white placeholder:text-slate-500"
                        />
                      </div>
                    </TabsContent>
                  </Tabs>
                </motion.div>
              )}

              {/* Step 2: Document Upload */}
              {step === 2 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="rounded-lg border border-dashed p-8 text-center">
                    <Upload className="mx-auto mb-4 size-12 text-slate-400" />
                    <h3 className="mb-2 text-lg font-medium">Upload Verification Documents</h3>
                    <p className="mb-4 text-sm text-slate-400">Drag and drop your documents or click to browse</p>
                    <Button className="bg-primary text-primary-foreground hover:opacity-90">Browse Files</Button>
                  </div>

                  {uploadProgress > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-slate-400">Uploading documents...</span>
                        <span className="font-medium">{uploadProgress}%</span>
                      </div>
                      <Progress value={uploadProgress} className="h-2 bg-slate-800">
                        <div className="h-full bg-gradient-to-r from-blue-500 to-teal-400" />
                      </Progress>
                      {uploadProgress === 100 && (
                        <div className="mt-2 flex items-center gap-2 text-sm text-green-400">
                          <Check className="size-4" />
                          <span>Documents uploaded successfully</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="rounded-lg bg-slate-800 p-4">
                    <h4 className="mb-2 font-medium">Required Documents</h4>
                    <ul className="space-y-2 text-sm text-slate-400">
                      <li className="flex items-center gap-2">
                        <div className="size-1.5 rounded-full bg-blue-500" />
                        <span>Proof of ownership</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="size-1.5 rounded-full bg-blue-500" />
                        <span>Asset valuation report</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="size-1.5 rounded-full bg-blue-500" />
                        <span>Identity verification</span>
                      </li>
                      <li className="flex items-center gap-2">
                        <div className="size-1.5 rounded-full bg-slate-600" />
                        <span>Additional supporting documents (optional)</span>
                      </li>
                    </ul>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Tokenization Parameters */}
              {step === 3 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="token-name" className="text-slate-300">
                        Token Name
                      </Label>
                      <Input
                        id="token-name"
                        placeholder="Enter token name"
                        defaultValue={`${assetType.charAt(0).toUpperCase() + assetType.slice(1)} Token`}
                        className="border-slate-700 bg-slate-800 text-white placeholder:text-slate-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="token-symbol" className="text-slate-300">
                        Token Symbol
                      </Label>
                      <Input
                        id="token-symbol"
                        placeholder="Enter token symbol"
                        defaultValue={assetType.substring(0, 3).toUpperCase()}
                        className="border-slate-700 bg-slate-800 text-white placeholder:text-slate-500"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-slate-300">Percentage to Tokenize</Label>
                        <span className="text-sm font-medium">{tokenizationPercent}%</span>
                      </div>
                      <Slider
                        defaultValue={[50]}
                        max={100}
                        step={1}
                        value={[tokenizationPercent]}
                        onValueChange={(value) => setTokenizationPercent(value[0])}
                        className="py-4"
                      />
                      <div className="flex items-center justify-between text-xs text-slate-500">
                        <span>0%</span>
                        <span>50%</span>
                        <span>100%</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg bg-slate-800 p-4">
                    <h4 className="mb-4 font-medium">Tokenization Preview</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <div className="text-sm text-slate-400">Asset Value</div>
                        <div className="text-lg font-medium">${assetValue.toLocaleString()}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-slate-400">Tokenized Value</div>
                        <div className="text-lg font-medium text-teal-400">${tokenizedValue.toLocaleString()}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-slate-400">Token Supply</div>
                        <div className="text-lg font-medium">{tokenizedValue.toLocaleString()}</div>
                      </div>
                      <div className="space-y-1">
                        <div className="text-sm text-slate-400">Initial Token Price</div>
                        <div className="text-lg font-medium">$1.00</div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Step 4: Review and Confirm */}
              {step === 4 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-6"
                >
                  <div className="rounded-lg bg-slate-800 p-4">
                    <h4 className="mb-4 font-medium">Tokenization Summary</h4>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                        <span className="text-slate-400">Asset Type</span>
                        <div className="flex items-center gap-2 font-medium">
                          {assetTypeIcons[assetType as keyof typeof assetTypeIcons]}
                          <span>{assetType.charAt(0).toUpperCase() + assetType.slice(1)}</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                        <span className="text-slate-400">Asset Value</span>
                        <span className="font-medium">${assetValue.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                        <span className="text-slate-400">Tokenization Percentage</span>
                        <span className="font-medium">{tokenizationPercent}%</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                        <span className="text-slate-400">Tokenized Value</span>
                        <span className="font-medium text-teal-400">${tokenizedValue.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between border-b border-slate-700 pb-2">
                        <span className="text-slate-400">Token Supply</span>
                        <span className="font-medium">{tokenizedValue.toLocaleString()}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-slate-400">Initial Token Price</span>
                        <span className="font-medium">$1.00</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg bg-blue-900/20 p-4">
                    <div className="flex items-center gap-4">
                      <div className="flex size-12 items-center justify-center rounded-full bg-green-900/30">
                        <Check className="size-6 text-green-400" />
                      </div>
                      <div>
                        <h4 className="font-medium">Ready to Tokenize</h4>
                        <p className="text-sm text-slate-400">Your asset is ready to be tokenized on the blockchain</p>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg border border-slate-700 bg-slate-800 p-4">
                    <h4 className="mb-2 font-medium">Legal Disclaimer</h4>
                    <p className="text-sm text-slate-400">
                      By proceeding with tokenization, you confirm that all provided information is accurate and that
                      you have the legal right to tokenize this asset. UnityVault is not responsible for any legal
                      issues arising from misrepresentation.
                    </p>
                  </div>
                </motion.div>
              )}
            </CardContent>
            <CardFooter className="flex justify-between">
              <Button
                variant="outline"
                onClick={handlePrevStep}
                disabled={step === 1}
                className="border-slate-700 text-white hover:bg-slate-800"
              >
                Back
              </Button>

              {step < 4 ? (
                <Button onClick={handleNextStep} className="bg-primary text-primary-foreground hover:opacity-90">
                  Continue
                  <ArrowRight className="ml-2 size-4" />
                </Button>
              ) : (
                <Button className="bg-gradient-to-r from-blue-500 to-teal-400 text-white hover:opacity-90">
                  Tokenize Asset
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  )
}
