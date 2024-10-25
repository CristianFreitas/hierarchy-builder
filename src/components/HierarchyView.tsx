import React, { useState } from 'react';

interface Hierarchy {
  [key: string]: Hierarchy | string[];
}

export const HierarchyView: React.FC = () => {
  const [hierarchy, setHierarchy] = useState<Hierarchy>({});
  const [currentKey, setCurrentKey] = useState('');
  const [currentValue, setCurrentValue] = useState('');
  const [parentKey, setParentKey] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState<{ [key: string]: boolean }>({});

  const addLevel = (key: string, value: string) => {
    if (!key.trim()) {
      setError("O nome do nível não pode estar vazio.");
      return;
    }

    const values = value.split(',').map(v => v.trim());
    const newHierarchy = { ...hierarchy };

    const levelExists = (obj: Hierarchy, levelKey: string): boolean => {
      return obj[levelKey] !== undefined;
    };

    if (levelExists(newHierarchy, key)) {
      setError("O nível já existe.");
      return;
    }

    if (parentKey) {
      const addSubLevel = (obj: Hierarchy, parentKey: string): Hierarchy => {
        for (const k in obj) {
          if (k === parentKey && Array.isArray(obj[k])) {
            obj[k] = { [key]: values };
            return obj;
          }
          if (typeof obj[k] === 'object') {
            addSubLevel(obj[k] as Hierarchy, parentKey);
          }
        }
        return obj;
      };

      setHierarchy(addSubLevel(newHierarchy, parentKey));
      setMessage(`Subnível '${key}' adicionado a '${parentKey}'`);
    } else {
      newHierarchy[key] = values;
      setHierarchy(newHierarchy);
      setMessage(`Nível '${key}' adicionado no topo`);
    }

    setCurrentKey('');
    setCurrentValue('');
    setParentKey(null);
    setError(null);
  };

  const deleteLevel = (key: string) => {
    const newHierarchy = { ...hierarchy };
    delete newHierarchy[key];
    setHierarchy(newHierarchy);
    setMessage(`Nível '${key}' removido`);
  };

  const toggleExpand = (key: string) => {
    setExpanded(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const downloadHierarchy = () => {
    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(
      JSON.stringify(hierarchy, null, 2)
    )}`;
    const link = document.createElement('a');
    link.href = jsonString;
    link.download = 'hierarchy.json';
    link.click();
  };

  const renderValue = (value: Hierarchy | string[]) => {
    if (Array.isArray(value)) {
      return value.join(', ');
    } else if (typeof value === 'object') {
      return Object.keys(value).join(', ');
    }
    return null;
  };

  return (
    <div className="container mx-auto p-6 min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold text-center mb-10 text-gray-800">Hierarchy Builder</h1>

      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {message}
        </div>
      )}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      <div className="mb-6">
        <input
          type="text"
          placeholder="Adicionar chave"
          className="border p-3 mr-2 w-full md:w-auto rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={currentKey}
          onChange={(e) => setCurrentKey(e.target.value)}
        />
        <input
          type="text"
          placeholder="Valores (separados por vírgula)"
          className="border p-3 mr-2 w-full md:w-auto rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={currentValue}
          onChange={(e) => setCurrentValue(e.target.value)}
        />
        {parentKey && <div className="text-gray-500 mt-2">Adicionando em: <strong>{parentKey}</strong></div>}
        <button
          onClick={() => addLevel(currentKey, currentValue)}
          className="bg-blue-500 text-white p-3 mt-4 rounded-lg hover:bg-blue-700 transition-all duration-200 ease-in-out shadow-lg disabled:bg-gray-400 disabled:cursor-not-allowed"
          disabled={!currentKey || !currentValue}
        >
          Adicionar Nível
        </button>
      </div>

      <ul className="mb-6">
        {Object.keys(hierarchy).map((key) => (
          <li key={key} className="mb-4 p-4 bg-white rounded-lg shadow-md">
            <strong className="text-xl text-gray-800">{key}:</strong>{' '}
            <span className="text-gray-600">{renderValue(hierarchy[key])}</span>
            <div className="mt-2">
              <button
                onClick={() => toggleExpand(key)}
                className="bg-gray-500 text-white ml-4 p-2 rounded-lg hover:bg-gray-700 transition-all duration-200 ease-in-out shadow-sm"
                aria-label={expanded[key] ? 'Colapsar' : 'Expandir'}
              >
                {expanded[key] ? "⬆️ Colapsar" : "⬇️ Expandir"}
              </button>
              <button
                onClick={() => deleteLevel(key)}
                className="bg-red-500 text-white ml-4 p-2 rounded-lg hover:bg-red-700 transition-all duration-200 ease-in-out shadow-sm"
              >
                Remover
              </button>
              <button
                onClick={() => setParentKey(key)}
                className="bg-yellow-500 text-white ml-4 p-2 rounded-lg hover:bg-yellow-700 transition-all duration-200 ease-in-out shadow-sm"
              >
                Adicionar Sub-nível
              </button>
            </div>
            {expanded[key] && typeof hierarchy[key] === 'object' && (
              <ul className="ml-6 mt-2">
                {Object.keys(hierarchy[key] as Hierarchy).map(subKey => (
                  <li key={subKey} className="ml-4">
                    <div className="text-gray-700">
                      <strong>{subKey}:</strong>{' '}
                      {renderValue((hierarchy[key] as Hierarchy)[subKey])}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>

      <button
        onClick={downloadHierarchy}
        className="bg-green-500 text-white p-3 rounded-lg hover:bg-green-700 transition-all duration-200 ease-in-out shadow-lg"
      >
        Download JSON
      </button>
    </div>
  );
};
