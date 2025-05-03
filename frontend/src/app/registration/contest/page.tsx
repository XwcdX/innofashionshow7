'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { FilePurpose, RegistrationType } from '@/types/registration'

type Category = 'INTERMEDIATE' | 'ADVANCED'
type UserType = 'INTERNAL' | 'EXTERNAL'

const loadDraftFromStorage = () => {
    if (typeof window === 'undefined') return null;
    const raw = localStorage.getItem('contest-draft');
    if (!raw) return null;
    try {
        return JSON.parse(raw);
    } catch (e) {
        console.error("Failed to parse contest draft from localStorage", e);
        localStorage.removeItem('contest-draft');
        return null;
    }
}

export default function ContestPage() {
    const { data: session, status } = useSession()
    const router = useRouter()

    // --- State ---
    const [category, setCategory] = useState<Category | null>(null);
    const [isLoadingCategory, setIsLoadingCategory] = useState(true);

    // Form field states
    const [age, setAge] = useState('');
    const [whatsapp, setWhatsapp] = useState('');
    const [nrp, setNrp] = useState('');
    const [batch, setBatch] = useState('');
    const [major, setMajor] = useState('');
    const [instance, setInstance] = useState('');

    const [proof, setProof] = useState<File | null>(null);
    const [ktm, setKtm] = useState<File | null>(null);
    const [idCard, setIdCard] = useState<File | null>(null);

    const [uploadedProofPath, setUploadedProofPath] = useState<string | null>(null);
    const [uploadedKtmPath, setUploadedKtmPath] = useState<string | null>(null);
    const [uploadedIdCardPath, setUploadedIdCardPath] = useState<string | null>(null);

    // --- Effects ---

    // 1. Check Authentication & Redirect
    useEffect(() => {
        if (status === 'unauthenticated') {
            router.replace(`/login?next=${encodeURIComponent('/registration/contest')}`);
        }
    }, [status, router]);

    // 2. Load Initial Draft (including Category) from localStorage ON MOUNT
    useEffect(() => {
        const draft = loadDraftFromStorage();
        if (draft) {
            if (draft.category && (draft.category === 'INTERMEDIATE' || draft.category === 'ADVANCED')) {
                setCategory(draft.category);
            }
            setAge(draft.age || '');
            setWhatsapp(draft.whatsapp || '');
            setNrp(draft.nrp || '');
            setBatch(draft.batch || '');
            setMajor(draft.major || '');
            setInstance(draft.instance || '');
            setUploadedProofPath(draft.proofPath || null);
            setUploadedKtmPath(draft.ktmPath || null);
            setUploadedIdCardPath(draft.idCardPath || null);
        }
        setIsLoadingCategory(false);
    }, []);

    // 3. Save Draft to localStorage whenever relevant state changes
    useEffect(() => {
        if (isLoadingCategory) return;

        const draft = {
            category,
            age,
            whatsapp,
            nrp,
            batch,
            major,
            instance,
            proofPath: uploadedProofPath,
            ktmPath: uploadedKtmPath,
            idCardPath: uploadedIdCardPath
        };
        localStorage.setItem('contest-draft', JSON.stringify(draft));
    }, [
        category, age, whatsapp, nrp, batch, major, instance,
        uploadedProofPath, uploadedKtmPath, uploadedIdCardPath,
        isLoadingCategory
    ]);

    // 4. Sync Draft with Server Periodically (Optional)

    useEffect(() => {
        if (status !== 'authenticated' || isLoadingCategory) return;

        const interval = setInterval(async () => {
            const raw = localStorage.getItem('contest-draft');
            if (!raw) return;
            try {
                const parsedDraft = JSON.parse(raw);
                const cleanedDraftToSend: Record<string, any> = {};

                for (const key in parsedDraft) {
                    if (Object.prototype.hasOwnProperty.call(parsedDraft, key)) {
                        const value = parsedDraft[key];
                        if (value !== null && value !== undefined && value !== "") {
                            cleanedDraftToSend[key] = value;
                        }
                    }
                }
                if (cleanedDraftToSend.category && Object.keys(cleanedDraftToSend).length > 0) {
                    console.log("Syncing cleaned draft to server:", cleanedDraftToSend);
                    const res = await fetch('/api/contest/draft', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(cleanedDraftToSend),
                    });

                    if (!res.ok) {
                        try {
                            const errorData = await res.json();
                            console.error(`Draft sync failed (${res.status}):`, errorData.message || errorData);
                        } catch (e) {
                            console.error(`Draft sync failed (${res.status}): ${await res.text()}`);
                        }
                    }
                } else {
                    console.log("Cleaned draft missing category or is empty, skipping sync.");
                }
            } catch (e) {
                console.error("Failed to process/sync draft:", e);
            }
        }, 60_000);
        return () => clearInterval(interval);
    }, [status, isLoadingCategory]);

    // --- Handlers ---

    const handleSelectCategory = (selectedCategory: Category) => {
        setCategory(selectedCategory);
    };

    const handleChangeCategory = () => {
        setCategory(null);
        const draft = loadDraftFromStorage() || {};
        draft.category = null;
        localStorage.setItem('contest-draft', JSON.stringify(draft));
    };

    // Reusable Upload Function (using shared types)
    async function uploadFile(
        file: File,
        registrationType: RegistrationType,
        filePurpose: FilePurpose,
        email: string,
        name: string,
        prevPath?: string
    ): Promise<string | null> {
        if (!email || !name) {
            console.error("Email or name missing for upload");
            alert("Cannot upload file: User information is missing.");
            return null;
        }
        try {
            const fd = new FormData();
            fd.append('file', file);
            fd.append('registrationType', registrationType);
            fd.append('filePurpose', filePurpose);
            fd.append('email', email);
            fd.append('name', name);
            if (prevPath) fd.append('prevPath', prevPath);

            const res = await fetch(`/api/upload`, { method: 'POST', body: fd });

            if (!res.ok) {
                let errorMsg = 'Server error during upload.';
                try {
                    const errorData = await res.json();
                    errorMsg = errorData.message || errorMsg;
                } catch (e) {
                    errorMsg = res.statusText || errorMsg;
                }
                console.error(`Upload failed for ${filePurpose}: ${res.status}`, errorMsg);
                alert(`Upload failed: ${errorMsg}. Please check file type/size and try again.`);
                return null;
            }

            const data = await res.json();
            if (data?.path) {
                return data.path as string;
            } else {
                console.error(`Upload response missing path for ${filePurpose}:`, data);
                alert(`Upload for ${filePurpose} succeeded but path was missing in response.`);
                return null;
            }

        } catch (error) {
            console.error(`Client-side error during upload for ${filePurpose}:`, error);
            alert(`An error occurred while trying to upload for ${filePurpose}. Check console.`);
            return null;
        }
    }

    // Final Form Submission Handler
    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!category) {
            alert("Category not selected."); return;
        }
        if (!age || !whatsapp) {
            alert('Please fill in Age and WhatsApp number.'); return;
        }
        if (!uploadedProofPath) {
            alert('Please upload Proof of Payment.'); return;
        }
        const userType = determineUserType(session?.user?.email);
        if (userType === 'INTERNAL' && !uploadedKtmPath) {
            alert('Please upload your KTM (Student ID Card).'); return;
        }
        if (userType === 'EXTERNAL' && !uploadedIdCardPath) {
            alert('Please upload your ID Card (KTP/Student Card).'); return;
        }
        if (userType === 'INTERNAL' && (!nrp || !batch || !major)) {
            alert('Please fill all Petra Student details (NRP, Batch, Major).'); return;
        }
        if (userType === 'EXTERNAL' && !instance) {
            alert('Please fill in your Institution/School name.'); return;
        }

        const finalFormData = new FormData();
        finalFormData.append('name', session!.user!.name!);
        finalFormData.append('email', session!.user!.email!);
        finalFormData.append('type', userType);
        finalFormData.append('category', category);
        finalFormData.append('age', age);
        finalFormData.append('whatsapp', whatsapp);
        finalFormData.append('proofOfPaymentPath', uploadedProofPath);

        if (userType === 'INTERNAL') {
            finalFormData.append('nrp', nrp);
            finalFormData.append('batch', batch);
            finalFormData.append('major', major);
            finalFormData.append('ktmPath', uploadedKtmPath!);
        } else {
            finalFormData.append('instance', instance);
            finalFormData.append('idCardPath', uploadedIdCardPath!);
        }

        // --- Send to Final Submission API ---
        try {
            const res = await fetch('/api/contest', {
                method: 'POST',
                body: finalFormData,
            });

            if (res.ok) {
                localStorage.removeItem('contest-draft');
                router.push('/thank-you');
            } else {
                let errorText = 'Submission failed due to a server error.';
                try {
                    const errorData = await res.json();
                    errorText = errorData.message || errorText;
                } catch (e) {
                    errorText = (await res.text()) || errorText;
                }
                console.error("Submission failed:", res.status, errorText);
                alert(`Submission failed: ${errorText}`);
            }
        } catch (error) {
            console.error("Client-side error during submission:", error);
            alert("An error occurred while submitting your registration. Please check the console or try again later.");
        }
    }

    // --- Helper to determine user type ---
    const determineUserType = (email: string | null | undefined): UserType => {
        if (!email) return 'EXTERNAL';
        const [localPart, domain] = email.split('@');
        const isInternal =
            localPart && domain === 'john.petra.ac.id' && /^[A-Za-z]\d{8}$/.test(localPart);
        return isInternal ? 'INTERNAL' : 'EXTERNAL';
    };

    // --- Render Logic ---
    if (status === 'loading' || isLoadingCategory) {
        return <p className="flex justify-center items-center min-h-screen text-lg font-semibold animate-pulse">Loading Registration...</p>;
    }
    if (status !== 'authenticated') {
        return <p className="flex justify-center items-center min-h-screen text-lg font-semibold">Redirecting to login...</p>;
    }

    // Show Category Selection Screen if not yet chosen
    if (!category) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center space-y-8 bg-gradient-to-br from-gray-50 to-gray-200 p-4">
                <h1 className="text-3xl font-bold text-gray-800 text-center">Select Contest Tier</h1>
                <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6">
                    <button
                        onClick={() => handleSelectCategory('INTERMEDIATE')}
                        className="px-8 py-4 bg-slate-700 text-white rounded-lg hover:bg-slate-800 transition duration-200 shadow-lg transform hover:scale-105 text-lg font-medium"
                    >
                        Intermediate
                    </button>
                    <button
                        onClick={() => handleSelectCategory('ADVANCED')}
                        className="px-8 py-4 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition duration-200 shadow-lg transform hover:scale-105 text-lg font-medium"
                    >
                        Advanced
                    </button>
                </div>
            </div>
        );
    }

    // --- Render the Main Form ---
    const currentRegistrationType: RegistrationType = 'contest';
    const name = session!.user!.name!;
    const email = session!.user!.email!;
    const userType = determineUserType(email);

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-2xl mx-auto bg-white p-6 md:p-8 shadow-xl rounded-lg border border-gray-200">
                <h1 className="text-2xl md:text-3xl font-bold text-center text-gray-800 mb-6">
                    Contest Registration
                </h1>

                {/* --- Category Display & Change Button --- */}
                <div className="mb-6 p-3 bg-indigo-50 border border-indigo-200 rounded-md flex items-center justify-between shadow-sm">
                    <div>
                        <span className="block text-xs font-medium text-indigo-600">Selected Tier:</span>
                        <span className="text-lg font-semibold text-indigo-900">{category}</span>
                    </div>
                    <button
                        onClick={handleChangeCategory}
                        title="Change category"
                        className="text-indigo-500 hover:text-indigo-800 font-bold text-2xl px-2 rounded-full hover:bg-indigo-100 transition duration-150 leading-none"
                        aria-label="Change category"
                    >
                        × {/* Better 'X' symbol */}
                    </button>
                </div>

                {/* --- Form --- */}
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Fieldset for Read Only Info */}
                    <fieldset className="border border-gray-300 p-4 rounded-md space-y-3 shadow-sm">
                        <legend className="text-sm font-semibold text-gray-700 px-2 -ml-2">Your Information</legend>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Name</label>
                            <input value={name} readOnly className="w-full bg-gray-100 border-gray-300 px-3 py-2 rounded-md text-gray-700 focus:outline-none cursor-not-allowed" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
                            <input value={email} readOnly className="w-full bg-gray-100 border-gray-300 px-3 py-2 rounded-md text-gray-700 focus:outline-none cursor-not-allowed" />
                        </div>
                    </fieldset>

                    {/* Fieldset for Shared Details */}
                    <fieldset className="border border-gray-300 p-4 rounded-md space-y-4 shadow-sm">
                        <legend className="text-sm font-semibold text-gray-700 px-2 -ml-2">Contact & Payment</legend>
                        <div>
                            <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">Age <span className="text-red-500">*</span></label>
                            <input
                                id="age" type="number" value={age} min="1"
                                onChange={e => setAge(e.target.value)}
                                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition"
                                required
                            />
                        </div>
                        <div>
                            <label htmlFor="whatsapp" className="block text-sm font-medium text-gray-700 mb-1">WhatsApp <span className="text-red-500">*</span></label>
                            <input
                                id="whatsapp" type="tel" placeholder="+62 8XX XXXX XXXX" value={whatsapp}
                                onChange={e => setWhatsapp(e.target.value)}
                                className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition"
                                required pattern="^\+?[0-9\s\-()]*$" title="Enter a valid phone number"
                            />
                        </div>
                        <div>
                            <label htmlFor="proof" className="block text-sm font-medium text-gray-700 mb-1">Proof of Payment <span className="text-red-500">*</span></label>
                            <input
                                id="proof" type="file" accept="image/jpeg,image/png,image/gif,application/pdf"
                                onChange={async e => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    setProof(file);
                                    const newPath = await uploadFile(file, currentRegistrationType, 'payment', email, name, uploadedProofPath ?? undefined);
                                    if (newPath) setUploadedProofPath(newPath);
                                    else setProof(null);
                                }}
                                className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition cursor-pointer"
                                required={!uploadedProofPath}
                            />
                            {uploadedProofPath && (
                                <div className="text-xs text-green-700 mt-1 flex items-center">
                                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                                    Uploaded: {uploadedProofPath.split('/').pop()}
                                </div>
                            )}
                            <p className="text-xs text-gray-500 mt-1">Max file size: 2MB. Allowed types: JPG, PNG, GIF, PDF.</p>
                        </div>
                    </fieldset>

                    {/* Fieldset for Conditional Fields */}
                    {userType === 'INTERNAL' ? (
                        <fieldset className="border border-gray-300 p-4 rounded-md space-y-4 shadow-sm">
                            <legend className="text-sm font-semibold text-gray-700 px-2 -ml-2">Petra Student Details</legend>
                            {/* NRP, Batch, Major Inputs */}
                            <div>
                                <label htmlFor="nrp" className="block text-sm font-medium text-gray-700 mb-1">NRP <span className="text-red-500">*</span></label>
                                <input id="nrp" value={nrp} onChange={e => setNrp(e.target.value)} className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition" required pattern="^[A-Za-z]\d{8}$" title="Enter NRP (e.g., c14200001)" />
                            </div>
                            <div>
                                <label htmlFor="batch" className="block text-sm font-medium text-gray-700 mb-1">Batch <span className="text-red-500">*</span></label>
                                <input id="batch" type="number" placeholder="e.g., 2022" value={batch} onChange={e => setBatch(e.target.value)} className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition" required min="2000" max="2024" />
                            </div>
                            <div>
                                <label htmlFor="major" className="block text-sm font-medium text-gray-700 mb-1">Major <span className="text-red-500">*</span></label>
                                <input id="major" value={major} onChange={e => setMajor(e.target.value)} className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition" required />
                            </div>
                            {/* KTM File Input */}
                            <div>
                                <label htmlFor="ktm" className="block text-sm font-medium text-gray-700 mb-1">KTM (Student ID Card) <span className="text-red-500">*</span></label>
                                <input
                                    id="ktm" type="file" accept="image/jpeg,image/png,image/gif,application/pdf"
                                    onChange={async e => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        setKtm(file);
                                        const newPath = await uploadFile(file, currentRegistrationType, 'ktm', email, name, uploadedKtmPath ?? undefined);
                                        if (newPath) setUploadedKtmPath(newPath);
                                        else setKtm(null);
                                    }}
                                    className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition cursor-pointer"
                                    required={!uploadedKtmPath}
                                />
                                {uploadedKtmPath && (
                                    <div className="text-xs text-green-700 mt-1 flex items-center">
                                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                                        Uploaded: {uploadedKtmPath.split('/').pop()}
                                    </div>
                                )}
                                <p className="text-xs text-gray-500 mt-1">Max file size: 2MB. Allowed types: JPG, PNG, GIF, PDF.</p>
                            </div>
                        </fieldset>
                    ) : (
                        <fieldset className="border border-gray-300 p-4 rounded-md space-y-4 shadow-sm">
                            <legend className="text-sm font-semibold text-gray-700 px-2 -ml-2">External User Details</legend>
                            {/* Institution Input */}
                            <div>
                                <label htmlFor="instance" className="block text-sm font-medium text-gray-700 mb-1">Institution/School <span className="text-red-500">*</span></label>
                                <input id="instance" value={instance} onChange={e => setInstance(e.target.value)} className="w-full border border-gray-300 px-3 py-2 rounded-md focus:ring-2 focus:ring-indigo-300 focus:border-indigo-500 transition" required />
                            </div>
                            {/* ID Card File Input */}
                            <div>
                                <label htmlFor="idCard" className="block text-sm font-medium text-gray-700 mb-1">ID Card (KTP/Student Card) <span className="text-red-500">*</span></label>
                                <input
                                    id="idCard" type="file" accept="image/jpeg,image/png,image/gif,application/pdf"
                                    onChange={async e => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        setIdCard(file);
                                        const newPath = await uploadFile(file, currentRegistrationType, 'idCard', email, name, uploadedIdCardPath ?? undefined);
                                        if (newPath) setUploadedIdCardPath(newPath);
                                        else setIdCard(null);
                                    }}
                                    className="w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 transition cursor-pointer"
                                    required={!uploadedIdCardPath}
                                />
                                {uploadedIdCardPath && (
                                    <div className="text-xs text-green-700 mt-1 flex items-center">
                                        <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path></svg>
                                        Uploaded: {uploadedIdCardPath.split('/').pop()}
                                    </div>
                                )}
                                <p className="text-xs text-gray-500 mt-1">Max file size: 2MB. Allowed types: JPG, PNG, GIF, PDF.</p>
                            </div>
                        </fieldset>
                    )}

                    {/* --- Submission Button --- */}
                    <button
                        type="submit"
                        className="w-full mt-4 bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 ease-in-out shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
                        disabled={
                            !age || !whatsapp || !uploadedProofPath ||
                            (userType === 'INTERNAL' && (!nrp || !batch || !major || !uploadedKtmPath)) ||
                            (userType === 'EXTERNAL' && (!instance || !uploadedIdCardPath))
                        }
                    >
                        Submit Registration
                    </button>
                </form>
            </div>
        </div>
    );
}