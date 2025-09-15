

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
// FIX: Import `GenerateContentResponse` for explicit type safety on the API response.
import { GoogleGenAI, Type, GenerateContentResponse } from "@google/genai";
import { RollData } from './types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

const BlochSphere: React.FC<{ latestRoll: RollData | null, isRolling: boolean }> = ({ latestRoll, isRolling }) => {
    const vectorAngle = !isRolling && latestRoll ? (latestRoll.roll - 3.5) / 3.5 * 90 : 0;
    const vectorTransform = !isRolling ? `rotate(${vectorAngle} 150 150)` : '';

    return (
        <g opacity={isRolling ? 0.8 : 0.6} filter="url(#glow)">
            {/* Sphere Body */}
            <circle cx="150" cy="150" r="60" fill="transparent" stroke="#4FD1C5" strokeWidth="1" />
            
            {/* Equator and Latitude Lines for 3D effect */}
            <path d="M 90 150 A 60 20 0 0 0 210 150" fill="none" stroke="#4FD1C5" strokeWidth="0.5" strokeDasharray="3 3" />
            <path d="M 90 150 A 60 20 0 0 1 210 150" fill="none" stroke="#4FD1C5" strokeWidth="0.5" />
            <path d="M 110 115 A 40 15 0 0 0 190 115" fill="none" stroke="#4FD1C5" strokeWidth="0.5" strokeDasharray="3 3" />
            <path d="M 110 115 A 40 15 0 0 1 190 115" fill="none" stroke="#4FD1C5" strokeWidth="0.5" />
            <path d="M 110 185 A 40 15 0 0 0 190 185" fill="none" stroke="#4FD1C5" strokeWidth="0.5" strokeDasharray="3 3" />
            <path d="M 110 185 A 40 15 0 0 1 190 185" fill="none" stroke="#4FD1C5" strokeWidth="0.5" />

            {/* Z-axis */}
            <line x1="150" y1="90" x2="150" y2="210" stroke="#4FD1C5" strokeWidth="0.5" />
            <text x="150" y="85" textAnchor="middle" fill="#A0AEC0" fontSize="10px">|0⟩</text>
            <text x="150" y="220" textAnchor="middle" fill="#A0AEC0" fontSize="10px">|1⟩</text>
            
            {/* State Vector */}
            <g transform={vectorTransform} className={isRolling ? 'animate-spin-slow' : ''} style={{ transformOrigin: '150px 150px' }}>
                <line x1="150" y1="150" x2="205" y2="150" stroke="#FBBF24" strokeWidth="2" />
                {/* Arrowhead */}
                <polygon points="210,150 202,147 202,153" fill="#FBBF24" />
            </g>
        </g>
    );
};


const OctahedronStateVisualization: React.FC<{ latestRoll: RollData | null, isRolling: boolean }> = ({ latestRoll, isRolling }) => {
    const vertices = useMemo(() => ({
        top: { x: 150, y: 50 },
        bottom: { x: 150, y: 250 },
        left: { x: 50, y: 150 },
        right: { x: 250, y: 150 },
        front: { x: 150, y: 200 },
        back: { x: 150, y: 100 },
    }), []);

    const faces = useMemo(() => {
        const v = vertices;
        const faceDefs = [
            { id: 0, qubit: "|000⟩", v: [v.top, v.left, v.front], type: 'front' },      
            { id: 1, qubit: "|001⟩", v: [v.top, v.front, v.right], type: 'front' },     
            { id: 2, qubit: "|010⟩", v: [v.top, v.right, v.back], type: 'back' },      
            { id: 3, qubit: "|011⟩", v: [v.top, v.back, v.left], type: 'back' },       
            { id: 4, qubit: "|100⟩", v: [v.bottom, v.front, v.left], type: 'front' },    
            { id: 5, qubit: "|101⟩", v: [v.bottom, v.back, v.right], type: 'back' },     
            { id: 6, qubit: "|110⟩", v: [v.bottom, v.left, v.back], type: 'back' },      
            { id: 7, qubit: "|111⟩", v: [v.bottom, v.right, v.front], type: 'front' },    
        ];
        return faceDefs.map(f => {
            const centroid = {
                x: (f.v[0].x + f.v[1].x + f.v[2].x) / 3,
                y: (f.v[0].y + f.v[1].y + f.v[2].y) / 3
            };
            const points = f.v.map(p => `${p.x},${p.y}`).join(' ');
            return { ...f, centroid, points };
        });
    }, [vertices]);

    const octagonPath = useMemo(() => {
        const center = 150;
        const radius = 145;
        return Array.from({ length: 8 }).map((_, i) => {
            const angle = Math.PI / 8 + (i * Math.PI) / 4;
            const x = center + radius * Math.cos(angle);
            const y = center + radius * Math.sin(angle);
            return `${x},${y}`;
        }).join(' ');
    }, []);

    const getFaceProps = (faceId: number) => {
        const isResult = latestRoll && faceId === latestRoll.roll;
        const isEntangled = latestRoll && faceId === latestRoll.face_down;
        const faceType = faces.find(f => f.id === faceId)?.type || 'front';
        
        let fill = 'fill-transparent';
        let stroke = 'stroke-gray-600';
        let opacity = 'opacity-100';

        if (latestRoll && !isRolling) {
            if (isResult) {
                fill = 'fill-cyan-400/80';
                stroke = 'stroke-cyan-200';
            } else if (isEntangled) {
                fill = 'fill-amber-400/80';
                stroke = 'stroke-amber-200';
            } else {
                 opacity = faceType === 'front' ? 'opacity-30' : 'opacity-10';
                 stroke = 'stroke-gray-700';
            }
        }
        return { fill, stroke, opacity };
    };

    return (
        <div className="relative w-full max-w-[300px] aspect-square mx-auto">
            <style>
                {`
                @keyframes spin-slow {
                  from { transform: rotate(0deg); }
                  to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                  animation: spin-slow 4s linear infinite;
                }
                `}
            </style>
            <svg viewBox="0 0 300 300" className={`transition-transform duration-500 ${isRolling ? 'animate-spin' : ''}`}>
                <defs>
                    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                        <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                <polygon points={octagonPath} className="fill-transparent stroke-gray-800" strokeWidth="1" />

                <BlochSphere latestRoll={latestRoll} isRolling={isRolling} />

                {faces.filter(f => f.type === 'back').map(face => {
                    const { fill, stroke, opacity } = getFaceProps(face.id);
                    return (
                        <polygon key={face.id} points={face.points} className={`transition-colors duration-300 ${fill} ${stroke} ${opacity}`} strokeWidth="1.5" />
                    );
                })}

                {!isRolling &&
                    Object.values(vertices).flatMap((v1, i) =>
                        Object.values(vertices).slice(i + 1).map((v2, j) => {
                             const distSq = Math.pow(v1.x - v2.x, 2) + Math.pow(v1.y - v2.y, 2);
                             if(distSq < 20000 && distSq > 9000) {
                                return <line key={`${i}-${j}`} x1={v1.x} y1={v1.y} x2={v2.x} y2={v2.y} className="stroke-gray-700 opacity-30" strokeWidth="1" />
                             }
                             return null;
                        })
                )}

                {faces.filter(f => f.type === 'front').map(face => {
                    const { fill, stroke, opacity } = getFaceProps(face.id);
                    return (
                         <g key={face.id} style={{ filter: latestRoll && (face.id === latestRoll.roll || face.id === latestRoll.face_down) ? 'url(#glow)' : 'none' }}>
                            <polygon points={face.points} className={`transition-colors duration-300 ${fill} ${stroke} ${opacity}`} strokeWidth="1.5" />
                        </g>
                    );
                })}
                
                {!isRolling && faces.map(face => (
                     <text
                        key={`text-${face.id}`}
                        x={face.centroid.x}
                        y={face.centroid.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        className="fill-white font-sans text-xs font-bold pointer-events-none"
                    >
                        <tspan x={face.centroid.x} dy="-0.4em">{face.id}</tspan>
                        <tspan x={face.centroid.x} dy="1.2em" className="text-[10px]">{face.qubit}</tspan>
                    </text>
                ))}
            </svg>
             {isRolling && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-900/50 rounded-full">
                    <p className="text-white text-lg font-semibold animate-pulse">Colapsando...</p>
                </div>
            )}
            {!isRolling && latestRoll && (
                 <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex space-x-4 p-1 rounded-lg bg-gray-800/50">
                    <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-cyan-400"></div>
                        <span className="text-white text-xs">Cara Resultante</span>
                    </div>
                     <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                        <span className="text-white text-xs">Cara Entrelazada</span>
                    </div>
                </div>
            )}
        </div>
    );
};

const QuantumErrorCorrectionVisualizer: React.FC<{ qecData: RollData['qec'] }> = ({ qecData }) => {
    if (!qecData) return null;
    const { physicalRolls, errorOccurred, wasCorrected } = qecData;
    const logicalResult = physicalRolls.reduce((a, b, i, arr) =>
        (arr.filter(v => v === a).length >= arr.filter(v => v === b).length ? a : b));

    return (
        <div className="mt-4 p-4 bg-gray-800 rounded-lg">
            <h3 className="text-center text-lg font-semibold text-white mb-3">Corrección de Errores Cuánticos (QEC)</h3>
            <div className="flex justify-around items-center">
                <div>
                    <p className="text-gray-400 text-sm">Mediciones Físicas:</p>
                    <div className="flex space-x-2 mt-1">
                        {physicalRolls.map((roll, index) => {
                            const isError = errorOccurred && roll !== logicalResult;
                            return (
                                <span key={index} className={`flex items-center justify-center w-10 h-10 rounded-md text-lg font-bold ${isError ? 'bg-red-500 text-white animate-pulse' : 'bg-gray-600 text-white'}`}>
                                    {roll}
                                </span>
                            );
                        })}
                    </div>
                </div>
                <div className="text-center">
                    <p className={`text-sm ${errorOccurred ? 'text-red-400' : 'text-green-400'}`}>
                        {errorOccurred ? "Error de Ruido Detectado" : "Sin Errores"}
                    </p>
                    {errorOccurred && wasCorrected && (
                        <p className="text-green-400 font-bold text-sm">¡Error Corregido!</p>
                    )}
                </div>
                 <div>
                     <p className="text-gray-400 text-sm">Resultado Lógico:</p>
                     <span className="flex items-center justify-center w-12 h-12 mt-1 rounded-lg bg-green-500 text-white text-2xl font-bold">
                         {logicalResult}
                    </span>
                 </div>
            </div>
        </div>
    );
};

const WaveFunctionVisualization: React.FC<{ waveFunction: number[] | undefined }> = ({ waveFunction }) => {
    if (!waveFunction) return null;
    const data = waveFunction.map((amp, index) => ({
        name: `|${index.toString(2).padStart(3, '0')}⟩`,
        amplitude: amp,
    }));
    const collapsedIndex = waveFunction.findIndex(amp => amp === 1);

    return (
        <div className="h-64 w-full">
            <h3 className="text-center text-lg font-semibold text-white mb-2">Ψ Función de Onda</h3>
            <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                    <XAxis dataKey="name" stroke="#A0AEC0" fontSize={12} />
                    <YAxis stroke="#A0AEC0" domain={[0, 1]} />
                    <Tooltip
                        contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }}
                        labelStyle={{ color: '#E2E8F0' }}
                    />
                    <Bar dataKey="amplitude" name="Amplitud">
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={index === collapsedIndex ? '#4FD1C5' : '#4A5568'} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

const Statistics: React.FC<{ history: RollData[] }> = ({ history }) => {
    const stats = useMemo(() => {
        if (history.length === 0) return null;
        const rolls = history.map(h => h.roll);
        const total = rolls.length;
        const mean = rolls.reduce((a, b) => a + b, 0) / total;
        const stdDev = Math.sqrt(rolls.map(x => Math.pow(x - mean, 2)).reduce((a, b) => a + b, 0) / total);
        const distribution = Array(8).fill(0).map((_, i) => {
            const count = rolls.filter(r => r === i).length;
            return { name: `${i}`, count, percentage: (count / total) * 100 };
        });
        const evenCount = rolls.filter(r => r % 2 === 0).length;
        return { total, mean, stdDev, distribution, evenCount };
    }, [history]);

    if (!stats) return null;

    return (
        <div>
            <h3 className="text-center text-lg font-semibold text-white mb-2">📊 Estadísticas</h3>
            <div className="text-sm space-y-2 text-gray-300 bg-gray-800 p-4 rounded-lg">
                <p>Total de lanzamientos: <span className="font-bold text-white">{stats.total}</span></p>
                <p>Valor promedio: <span className="font-bold text-white">{stats.mean.toFixed(2)}</span></p>
                <p>Desviación Estándar: <span className="font-bold text-white">{stats.stdDev.toFixed(2)}</span></p>
                <div className="pt-2">
                    <p className="font-semibold mb-1 text-gray-200">Distribución de valores:</p>
                    <div className="w-full h-40">
                         <ResponsiveContainer>
                            <BarChart data={stats.distribution} layout="vertical" margin={{ top: 0, right: 20, left: 0, bottom: 0 }}>
                                <XAxis type="number" hide />
                                <YAxis type="category" dataKey="name" stroke="#A0AEC0" width={15} tick={{ fontSize: 10 }} />
                                <Tooltip
                                    cursor={{ fill: 'rgba(255, 255, 255, 0.1)' }}
                                    formatter={(value: number) => [`${value.toFixed(1)}%`, 'Porcentaje']}
                                    contentStyle={{ backgroundColor: '#1A202C' }}
                                />
                                <Bar dataKey="percentage" fill="#4FD1C5" background={{ fill: '#4A5568' }}/>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>
        </div>
    );
};

const StateVectorDisplay: React.FC<{ amplitudes: number[] }> = ({ amplitudes }) => {
    if (!amplitudes || amplitudes.length === 0) return null;

    const totalProbability = amplitudes.reduce((sum, p) => sum + p, 0);
    const normalizedAmplitudes = totalProbability > 0 ? amplitudes.map(p => p / totalProbability) : amplitudes;
    const vectorData = normalizedAmplitudes.map((prob, index) => ({
        state: `|${index.toString(2).padStart(3, '0')}⟩`,
        probability: prob * 100,
    }));
    const maxProb = vectorData.length > 0 ? Math.max(...vectorData.map(d => d.probability)) : 0;

    return (
        <div className="mt-6 text-sm text-gray-300">
            <h4 className="text-center text-md font-semibold text-white mb-3">Detalle del Vector de Estado |ψ⟩</h4>
            <div className="bg-gray-900/50 p-3 rounded-lg grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                {vectorData.map((item, index) => (
                    <div 
                        key={index} 
                        className={`grid grid-cols-[auto,1fr,auto] gap-x-3 items-center p-1.5 rounded-md transition-colors duration-300 ${item.probability.toFixed(2) === maxProb.toFixed(2) && maxProb > 0.1 ? 'bg-cyan-500/20' : 'bg-transparent'}`}
                    >
                        <span className="font-mono font-semibold text-cyan-300 w-12">{item.state}</span>
                        <div className="w-full bg-gray-700 rounded-full h-3 relative overflow-hidden">
                             <div 
                                className="bg-cyan-400 h-3 rounded-full transition-all duration-300 ease-in-out" 
                                style={{ width: `${item.probability}%` }}
                             ></div>
                        </div>
                        <span className="font-mono text-right w-16">{item.probability.toFixed(2)}%</span>
                    </div>
                ))}
            </div>
             <div className="text-center mt-3 text-xs text-gray-500">
                Suma de Probabilidades (P): {totalProbability.toFixed(4)}
            </div>
        </div>
    );
};


const QuantumDynamicsSimulator: React.FC<{ latestRoll: RollData | null }> = ({ latestRoll }) => {
    const [useHamiltonian, setUseHamiltonian] = useState(false);
    const [decoherence, setDecoherence] = useState(0);
    const [amplitudes, setAmplitudes] = useState<number[]>([]);
    const animationFrameRef = useRef<number>();
    const startTimeRef = useRef<number>();

    useEffect(() => {
        if (!latestRoll) {
            setAmplitudes([]);
            return;
        }

        const baseAmplitudes = latestRoll.waveFunction;
        startTimeRef.current = undefined; 

        const animate = (timestamp: number) => {
            if (startTimeRef.current === undefined) startTimeRef.current = timestamp;
            const elapsedTime = timestamp - startTimeRef.current;

            if (!useHamiltonian && decoherence === 0) {
                setAmplitudes(baseAmplitudes);
                if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
                return;
            }
            
            const newAmplitudes = Array(8).fill(0);
            const decay = Math.exp(-decoherence * elapsedTime * 0.0002);

            if (useHamiltonian) {
                const omega = 0.002;
                const cos_t = Math.cos(elapsedTime * omega);
                const sin_t = Math.sin(elapsedTime * omega);
                const amp1 = cos_t * decay;
                const amp2 = -sin_t * decay;
                newAmplitudes[latestRoll.roll] = amp1 * amp1;
                newAmplitudes[latestRoll.face_down] = amp2 * amp2;
                const remainingProb = 1 - (newAmplitudes[latestRoll.roll] + newAmplitudes[latestRoll.face_down]);
                const leakage = remainingProb > 0 ? remainingProb / 6 : 0;
                for (let i = 0; i < 8; i++) {
                    if (i !== latestRoll.roll && i !== latestRoll.face_down) newAmplitudes[i] += leakage;
                }
            } else {
                const mainProb = decay * decay;
                newAmplitudes[latestRoll.roll] = mainProb;
                const lostProb = 1 - mainProb;
                const leakage = lostProb > 0 ? lostProb / 7 : 0;
                for (let i = 0; i < 8; i++) {
                    if (i !== latestRoll.roll) newAmplitudes[i] += leakage;
                }
            }
            setAmplitudes(newAmplitudes);
            animationFrameRef.current = requestAnimationFrame(animate);
        };
        
        animationFrameRef.current = requestAnimationFrame(animate);

        return () => {
            if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
        };
    }, [latestRoll, useHamiltonian, decoherence]);


    if (!latestRoll) return null;
    
    const data = amplitudes.map((amp, index) => ({
        name: `|${index.toString(2).padStart(3, '0')}⟩`,
        amplitude: amp,
    }));
    
    return (
        <div className="mt-6 p-4 bg-gray-800 rounded-lg">
            <h3 className="text-center text-lg font-semibold text-white mb-4">Dinámica Cuántica</h3>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-4">
                 <label className="flex items-center space-x-2 text-white cursor-pointer">
                    <input type="checkbox" checked={useHamiltonian} onChange={() => setUseHamiltonian(p => !p)} className="form-checkbox h-5 w-5 text-cyan-400 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500" />
                    <span>Dinámica Hamiltoniana</span>
                </label>
                 <div className="flex items-center space-x-2 text-white w-full sm:w-auto">
                    <span>Decoherencia (Lindblad):</span>
                     <input type="range" min="0" max="1" step="0.01" value={decoherence} onChange={(e) => setDecoherence(parseFloat(e.target.value))} className="w-full sm:w-32"/>
                </div>
            </div>
            <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data} margin={{ top: 5, right: 20, left: -20, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#4A5568" />
                        <XAxis dataKey="name" stroke="#A0AEC0" fontSize={12} />
                        <YAxis stroke="#A0AEC0" domain={[0, 1]} />
                        <Tooltip
                            contentStyle={{ backgroundColor: '#1A202C', border: '1px solid #4A5568' }}
                            labelStyle={{ color: '#E2E8F0' }}
                        />
                        <Bar dataKey="amplitude" name="Amplitud" fill="#8884d8">
                             {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={'#4FD1C5'} opacity={Math.sqrt(entry.amplitude)} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <StateVectorDisplay amplitudes={amplitudes} />
        </div>
    );
};

const Tutorial: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    const concepts = [
        { title: 'Colapso de la Función de Onda', description: 'Antes de medir, un qubit existe en una superposición de todos los estados posibles. La medición (lanzamiento) lo "colapsa" a un único resultado definitivo (0-7).' },
        { title: 'Entrelazamiento', description: 'La cara resultante y su opuesta están entrelazadas. Conocer una revela instantáneamente la otra (siempre suman 7), sin importar la "distancia".' },
        { title: 'Hamiltoniano', description: 'Representa la energía total del sistema. En este modelo idealizado, es constante (7) en cada lanzamiento, simbolizando una ley de conservación.' },
        { title: 'Corrección de Errores (QEC)', description: 'Usa qubits físicos redundantes para codificar un qubit lógico. Al medir los qubits físicos, puede detectar y corregir errores causados por el ruido ambiental.' },
    ];

    return (
        <div className="mb-6 p-4 bg-cyan-900/50 border border-cyan-700 rounded-lg text-sm">
            <div className="flex justify-between items-start">
                <div className="flex-grow">
                    <h3 className="font-bold text-lg text-cyan-300 mb-2">🎓 ¡Bienvenido al Simulador Cuántico!</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2 text-gray-300">
                        {concepts.map(c => (
                            <p key={c.title}>
                                <strong className="font-semibold text-white">{c.title}:</strong> {c.description}
                            </p>
                        ))}
                    </div>
                </div>
                <button onClick={onClose} className="ml-4 text-2xl text-cyan-400 hover:text-white transition-colors">&times;</button>
            </div>
        </div>
    );
};

const RollDetails: React.FC<{ latestRoll: RollData | null }> = ({ latestRoll }) => {
    if (!latestRoll) {
        return (
            <div className="h-full flex flex-col items-center justify-center bg-gray-800/50 p-6 rounded-lg text-gray-500">
                <p>Esperando el primer lanzamiento...</p>
                <p className="text-sm">Haga clic en "Lanzar Dado Cuántico" para comenzar.</p>
            </div>
        );
    }

    const detailItems = [
        { label: 'Resultado | Entrelazado', value: `${latestRoll.roll} | ${latestRoll.face_down}`, color: 'text-cyan-300' },
        { label: 'Estado Qubit', value: latestRoll.qubitState, color: 'text-white' },
        { label: 'Hamiltoniano', value: latestRoll.hamiltonian, color: 'text-amber-300' },
        { label: 'Cos(π * Roll)', value: latestRoll.roll_cos.toFixed(2), color: 'text-fuchsia-300' },
        { label: 'Cos(π * Face Down)', value: latestRoll.face_down_cos.toFixed(2), color: 'text-fuchsia-300' },
        { label: 'Paridad (Roll)', value: latestRoll.roll_parity, color: 'text-green-300' },
        { label: 'Paridad (Face Down)', value: latestRoll.face_down_parity, color: 'text-green-300' },
    ];

    return (
        <div className="bg-gray-800 p-4 rounded-lg h-full">
            <h3 className="text-center text-lg font-semibold text-white mb-4">🔬 Propiedades del Lanzamiento</h3>
            <div className="space-y-2">
                {detailItems.map(item => (
                    <div key={item.label} className="grid grid-cols-2 gap-2 items-center text-sm bg-gray-900/50 p-2 rounded-md">
                        <span className="text-gray-400">{item.label}:</span>
                        <span className={`font-mono text-right font-bold text-base ${item.color}`}>{item.value}</span>
                    </div>
                ))}
            </div>
        </div>
    );
};


const App: React.FC = () => {
    const [history, setHistory] = useState<RollData[]>([]);
    const [isRolling, setIsRolling] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [useQEC, setUseQEC] = useState<boolean>(false);
    const [batchSize, setBatchSize] = useState<number>(10);
    const [isBatchRolling, setIsBatchRolling] = useState<boolean>(false);
    const [batchProgress, setBatchProgress] = useState<number>(0);
    const [showTutorial, setShowTutorial] = useState<boolean>(true);
    const stopBatchRef = useRef<boolean>(false);

    const latestRoll = history.length > 0 ? history[history.length - 1] : null;

    const rollDice = async () => {
        setError(null);
        try {
            if (!process.env.API_KEY) throw new Error("API_KEY environment variable not set.");
            const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
            const prompt = `Simulate a quantum roll of an 8-sided die (octahedron, faces 0-7). The result must be a single JSON object.
- 'roll': The final collapsed state (0-7).
- 'face_down': The opposite, entangled face. 'roll' + 'face_down' must equal 7.
- 'hamiltonian': The total energy of the system. Must be 7.
- 'roll_cos': The cosine operator for the roll, calculated as cos(PI * roll).
- 'face_down_cos': The cosine operator for the face_down value, cos(PI * face_down).
- 'roll_parity' & 'face_down_parity': String, 'par' or 'impar'.
- 'qubitState': The 3-qubit basis state string for the roll (e.g., |010⟩ for roll 2).
- 'waveFunction': An 8-element array representing the collapsed wave function (1.0 at the roll's index, 0.0 elsewhere).
${useQEC ? `
- 'qec': Simulate Quantum Error Correction for the roll.
  - 'physicalRolls': An array of 3 numbers. Start with three copies of the logical 'roll'. Then, with a 33.3% probability, introduce a single random error to one of the three values (e.g., [5, 5, 5] becomes [5, 2, 5]).
  - 'errorOccurred': Boolean, must be true if an error was introduced, false otherwise.
  - 'wasCorrected': Boolean, must always be true, as the majority vote corrects the single error.` : ''}
Return ONLY the raw JSON object, without any markdown formatting.`;

            const schema: any = {
                type: Type.OBJECT,
                properties: {
                    roll: { type: Type.INTEGER }, face_down: { type: Type.INTEGER },
                    hamiltonian: { type: Type.INTEGER }, roll_cos: { type: Type.NUMBER },
                    face_down_cos: { type: Type.NUMBER }, roll_parity: { type: Type.STRING },
                    face_down_parity: { type: Type.STRING }, qubitState: { type: Type.STRING },
                    waveFunction: { type: Type.ARRAY, items: { type: Type.NUMBER } },
                },
                required: ['roll', 'face_down', 'hamiltonian', 'roll_cos', 'face_down_cos', 'roll_parity', 'face_down_parity', 'qubitState', 'waveFunction']
            };

            if (useQEC) {
                schema.properties.qec = {
                    type: Type.OBJECT,
                    properties: {
                        physicalRolls: { type: Type.ARRAY, items: { type: Type.INTEGER } },
                        errorOccurred: { type: Type.BOOLEAN },
                        wasCorrected: { type: Type.BOOLEAN }
                    },
                    required: ['physicalRolls', 'errorOccurred', 'wasCorrected']
                };
                schema.required.push('qec');
            }
            const response: GenerateContentResponse = await ai.models.generateContent({
                model: "gemini-2.5-flash",
                contents: prompt,
                config: { responseMimeType: "application/json", responseSchema: schema },
            });
            // FIX: Use response.text to access the generated content as a string.
            // The previous method of accessing response.candidates is deprecated and was causing errors.
            const jsonStr = response.text.trim();
            const newRoll: RollData = JSON.parse(jsonStr);
            setHistory(prev => [...prev, newRoll]);
        } catch (e: any) {
            console.error(e);
            let errorMessage = e.message || "An unexpected error occurred.";
            if (typeof errorMessage === 'string' && (errorMessage.includes('429') || errorMessage.includes('RESOURCE_EXHAUSTED'))) {
                errorMessage = "Se ha alcanzado el límite de solicitudes (429). Espere un momento o reduzca la velocidad/tamaño de los lanzamientos en lote.";
            }
            setError(errorMessage);
            if (isBatchRolling) stopBatchRef.current = true;
        }
    };
    
    const handleSingleRoll = async () => {
        setIsRolling(true);
        await rollDice();
        setIsRolling(false);
    }

    const startBatchRoll = async () => {
        setIsBatchRolling(true);
        stopBatchRef.current = false;
        setBatchProgress(0);
        for (let i = 0; i < batchSize; i++) {
            if (stopBatchRef.current) break;
            setBatchProgress(i + 1);
            setIsRolling(true);
            await rollDice();
            setIsRolling(false);
            // FIX: Increased delay to 1000ms to avoid hitting API rate limits.
            await new Promise(res => setTimeout(res, 1000));
        }
        setIsBatchRolling(false);
        setBatchProgress(0);
    };

    const stopBatchRoll = () => { stopBatchRef.current = true; };
    const clearHistory = () => { setHistory([]); setError(null); };
    const isUIBusy = isRolling || isBatchRolling;

    return (
        <div className="bg-gray-900 text-gray-200 min-h-screen font-sans p-4 sm:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                <header className="text-center mb-8">
                    <h1 className="text-4xl sm:text-5xl font-bold text-white">🎲 Simulador de Dado Cuántico 🎲</h1>
                    <p className="mt-4 max-w-2xl mx-auto text-gray-400">
                        Una simulación de un sistema de 3 qubits representado como un dado de 8 caras. Cada lanzamiento colapsa la función de onda a un estado base, demostrando conceptos como entrelazamiento, superposición y corrección de errores cuánticos, todo impulsado por la API de Gemini.
                    </p>
                </header>

                <main className="bg-gray-800/50 p-6 rounded-2xl shadow-2xl shadow-cyan-500/10">
                    {showTutorial && <Tutorial onClose={() => setShowTutorial(false)} />}
                    <div className="flex flex-col items-center gap-4 mb-6">
                        <div className="flex flex-wrap justify-center items-center gap-4">
                             <button onClick={handleSingleRoll} disabled={isUIBusy} className="px-6 py-3 font-bold text-white bg-cyan-600 rounded-lg hover:bg-cyan-500 disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 shadow-lg">
                                {isRolling && !isBatchRolling ? "Lanzando..." : "Lanzar Dado Cuántico"}
                            </button>
                            <button onClick={clearHistory} disabled={isUIBusy || history.length === 0} className="px-4 py-2 text-sm font-semibold text-white bg-red-600 rounded-lg hover:bg-red-500 disabled:bg-gray-600 disabled:opacity-50 transition-colors">
                                🗑️ Limpiar Historial
                            </button>
                            <label className="flex items-center space-x-2 text-white cursor-pointer select-none">
                                <input type="checkbox" checked={useQEC} onChange={() => setUseQEC(p => !p)} disabled={isUIBusy} className="form-checkbox h-5 w-5 text-cyan-400 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500 disabled:opacity-50" />
                                <span>Activar Corrección de Errores (QEC)</span>
                            </label>
                        </div>
                        
                        <div className="flex flex-wrap items-center justify-center gap-2 mt-4 p-3 bg-gray-900/40 rounded-lg w-full max-w-xl">
                            <span className="text-sm font-semibold text-white">Tiradas Automáticas:</span>
                             <input type="number" value={batchSize} onChange={(e) => setBatchSize(Math.max(1, parseInt(e.target.value) || 1))} className="w-20 bg-gray-800 border border-gray-600 rounded-md text-center py-1 disabled:opacity-50" disabled={isUIBusy} />
                             <button onClick={() => setBatchSize(10)} disabled={isUIBusy} className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded-md disabled:opacity-50">10</button>
                             <button onClick={() => setBatchSize(50)} disabled={isUIBusy} className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded-md disabled:opacity-50">50</button>
                             <button onClick={() => setBatchSize(100)} disabled={isUIBusy} className="px-3 py-1 text-xs bg-gray-700 hover:bg-gray-600 rounded-md disabled:opacity-50">100</button>
                             <button onClick={isBatchRolling ? stopBatchRoll : startBatchRoll} disabled={isRolling && !isBatchRolling} className="px-4 py-2 font-semibold text-white bg-indigo-600 rounded-lg hover:bg-indigo-500 disabled:bg-gray-600 transition-colors">
                                 {isBatchRolling ? `Detener (${batchProgress}/${batchSize})` : "Iniciar Lote"}
                            </button>
                        </div>
                    </div>

                    {error && (
                        <div className="text-center my-4 p-3 bg-red-900/50 border border-red-500 text-red-300 rounded-lg">
                            <strong>Error:</strong> {error}
                        </div>
                    )}
                    
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-6 items-start">
                        <div className="md:col-span-2 flex flex-col items-center">
                             <OctahedronStateVisualization latestRoll={latestRoll} isRolling={isRolling} />
                        </div>
                        <div className="md:col-span-3">
                             <RollDetails latestRoll={latestRoll} />
                        </div>
                    </div>
                    {latestRoll?.qec && <QuantumErrorCorrectionVisualizer qecData={latestRoll.qec} />}

                    
                    {history.length > 0 && (
                        <div className="mt-8 pt-8 border-t border-gray-700">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <WaveFunctionVisualization waveFunction={latestRoll?.waveFunction} />
                                <Statistics history={history} />
                            </div>
                            <QuantumDynamicsSimulator latestRoll={latestRoll} />
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default App;