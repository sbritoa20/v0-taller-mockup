"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AlertTriangle, MapPin, Clock, Users, Phone, Truck, Shield, Activity, Sun, Moon } from "lucide-react"

interface Incidente {
  id: string
  tipo: "incendio" | "accidente" | "medica"
  descripcion: string
  ubicacion: string
  coordenadas: { lat: number; lng: number }
  estado: "pendiente" | "en_atencion" | "resuelto"
  prioridad: "alta" | "media" | "baja"
  recursos_asignados: string[]
  hora_reporte: string
  tiempo_respuesta?: string
}

const incidentesIniciales: Incidente[] = [
  {
    id: "INC-001",
    tipo: "incendio",
    descripcion: "Incendio en edificio residencial - 3er piso",
    ubicacion: "Calle 45 #23-67, Centro",
    coordenadas: { lat: 4.6097, lng: -74.0817 },
    estado: "en_atencion",
    prioridad: "alta",
    recursos_asignados: ["Bomberos-01", "Ambulancia-03"],
    hora_reporte: "14:23",
    tiempo_respuesta: "8 min",
  },
  {
    id: "INC-002",
    tipo: "accidente",
    descripcion: "Accidente de tránsito con heridos",
    ubicacion: "Av. Caracas con Calle 72",
    coordenadas: { lat: 4.6533, lng: -74.0636 },
    estado: "pendiente",
    prioridad: "alta",
    recursos_asignados: [],
    hora_reporte: "14:45",
  },
  {
    id: "INC-003",
    tipo: "medica",
    descripcion: "Emergencia médica - Infarto",
    ubicacion: "Centro Comercial Andino",
    coordenadas: { lat: 4.6692, lng: -74.0563 },
    estado: "en_atencion",
    prioridad: "alta",
    recursos_asignados: ["Ambulancia-01"],
    hora_reporte: "14:12",
    tiempo_respuesta: "12 min",
  },
  {
    id: "INC-004",
    tipo: "accidente",
    descripcion: "Choque menor sin heridos",
    ubicacion: "Calle 26 con Carrera 7",
    coordenadas: { lat: 4.6126, lng: -74.0705 },
    estado: "resuelto",
    prioridad: "baja",
    recursos_asignados: ["Policia-02"],
    hora_reporte: "13:30",
    tiempo_respuesta: "15 min",
  },
]

const recursos = [
  { id: "Ambulancia-01", tipo: "ambulancia", estado: "ocupado" },
  { id: "Ambulancia-02", tipo: "ambulancia", estado: "disponible" },
  { id: "Ambulancia-03", tipo: "ambulancia", estado: "ocupado" },
  { id: "Bomberos-01", tipo: "bomberos", estado: "ocupado" },
  { id: "Bomberos-02", tipo: "bomberos", estado: "disponible" },
  { id: "Policia-01", tipo: "policia", estado: "disponible" },
  { id: "Policia-02", tipo: "policia", estado: "disponible" },
]

export default function SistemaGestionEmergencias() {
  const [incidentes, setIncidentes] = useState<Incidente[]>(incidentesIniciales)
  const [filtroEstado, setFiltroEstado] = useState<string>("todos")
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [nuevoIncidente, setNuevoIncidente] = useState({
    tipo: "",
    descripcion: "",
    ubicacion: "",
    prioridad: "media",
  })

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [isDarkMode])

  useEffect(() => {
    const interval = setInterval(() => {
      setIncidentes((prev) =>
        prev.map((inc) => {
          if (inc.estado === "pendiente" && Math.random() > 0.8) {
            return {
              ...inc,
              estado: "en_atencion" as const,
              tiempo_respuesta: `${Math.floor(Math.random() * 20) + 5} min`,
            }
          }
          if (inc.estado === "en_atencion" && Math.random() > 0.9) {
            return { ...inc, estado: "resuelto" as const }
          }
          return inc
        }),
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const incidentesFiltrados = incidentes.filter((inc) => filtroEstado === "todos" || inc.estado === filtroEstado)

  const estadisticas = {
    total: incidentes.length,
    pendientes: incidentes.filter((i) => i.estado === "pendiente").length,
    en_atencion: incidentes.filter((i) => i.estado === "en_atencion").length,
    resueltos: incidentes.filter((i) => i.estado === "resuelto").length,
  }

  const getEstadoBadge = (estado: string) => {
    const variants = {
      pendiente: "destructive",
      en_atencion: "default",
      resuelto: "secondary",
    }
    return variants[estado as keyof typeof variants] || "default"
  }

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case "incendio":
        return "🔥"
      case "accidente":
        return "🚗"
      case "medica":
        return "🏥"
      default:
        return "⚠️"
    }
  }

  const agregarIncidente = () => {
    if (!nuevoIncidente.tipo || !nuevoIncidente.descripcion || !nuevoIncidente.ubicacion) return

    const nuevo: Incidente = {
      id: `INC-${String(incidentes.length + 1).padStart(3, "0")}`,
      tipo: nuevoIncidente.tipo as any,
      descripcion: nuevoIncidente.descripcion,
      ubicacion: nuevoIncidente.ubicacion,
      coordenadas: { lat: 4.6 + Math.random() * 0.1, lng: -74.08 + Math.random() * 0.1 },
      estado: "pendiente",
      prioridad: nuevoIncidente.prioridad as any,
      recursos_asignados: [],
      hora_reporte: new Date().toLocaleTimeString("es-CO", { hour: "2-digit", minute: "2-digit" }),
    }

    setIncidentes((prev) => [nuevo, ...prev])
    setNuevoIncidente({ tipo: "", descripcion: "", ubicacion: "", prioridad: "media" })
  }

  return (
    <div className="min-h-screen bg-background p-2 sm:p-4">
      <div className="max-w-7xl mx-auto space-y-4 sm:space-y-6">
        {/* Header */}
        <Card className="shadow-lg border-primary/20">
          <CardContent className="p-3 sm:p-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex-1 min-w-0">
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground flex items-center gap-2 sm:gap-3">
                  <AlertTriangle className="text-accent w-5 h-5 sm:w-6 sm:h-6" />
                  <span className="truncate">Sistema de Gestión de Emergencias</span>
                </h1>
                <p className="text-muted-foreground mt-1 sm:mt-2 text-sm sm:text-base">
                  Panel de Control - Alcaldía Municipal
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4 w-full sm:w-auto">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="flex items-center gap-2 w-full sm:w-auto"
                >
                  {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  <span className="sm:inline">{isDarkMode ? "Modo Claro" : "Modo Oscuro"}</span>
                </Button>
                <div className="flex items-center gap-2 text-sm">
                  <Activity className="w-4 h-4 text-emerald-500" />
                  <span className="text-emerald-600 font-medium">Sistema Operativo 24/7</span>
                </div>
                <div className="text-xs sm:text-sm text-muted-foreground">
                  Última actualización: {new Date().toLocaleTimeString("es-CO")}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Estadísticas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-4">
          <Card className="border-primary/20 hover:shadow-lg transition-shadow">
            <CardContent className="p-3 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Total Incidentes</p>
                  <p className="text-lg sm:text-2xl font-bold text-primary">{estadisticas.total}</p>
                </div>
                <AlertTriangle className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-accent/20 hover:shadow-lg transition-shadow">
            <CardContent className="p-3 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Pendientes</p>
                  <p className="text-lg sm:text-2xl font-bold text-accent">{estadisticas.pendientes}</p>
                </div>
                <Clock className="w-6 h-6 sm:w-8 sm:h-8 text-accent" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-primary/20 hover:shadow-lg transition-shadow">
            <CardContent className="p-3 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">En Atención</p>
                  <p className="text-lg sm:text-2xl font-bold text-primary">{estadisticas.en_atencion}</p>
                </div>
                <Users className="w-6 h-6 sm:w-8 sm:h-8 text-primary" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-emerald-500/20 hover:shadow-lg transition-shadow">
            <CardContent className="p-3 sm:p-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <p className="text-xs sm:text-sm font-medium text-muted-foreground">Resueltos</p>
                  <p className="text-lg sm:text-2xl font-bold text-emerald-600">{estadisticas.resueltos}</p>
                </div>
                <Shield className="w-6 h-6 sm:w-8 sm:h-8 text-emerald-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="incidentes" className="space-y-4">
          <div className="overflow-x-auto">
            <TabsList className="grid w-full grid-cols-4 bg-muted min-w-max sm:min-w-0">
              <TabsTrigger
                value="incidentes"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm px-2 sm:px-4"
              >
                Incidentes
              </TabsTrigger>
              <TabsTrigger
                value="mapa"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm px-2 sm:px-4"
              >
                Mapa
              </TabsTrigger>
              <TabsTrigger
                value="recursos"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm px-2 sm:px-4"
              >
                Recursos
              </TabsTrigger>
              <TabsTrigger
                value="reportes"
                className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground text-xs sm:text-sm px-2 sm:px-4"
              >
                Reportes
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="incidentes" className="space-y-4">
            <Card className="border-accent/20">
              <CardHeader className="bg-accent/5 p-3 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-accent text-sm sm:text-base">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5" />
                  Registrar Nuevo Incidente
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <Select
                    value={nuevoIncidente.tipo}
                    onValueChange={(value) => setNuevoIncidente((prev) => ({ ...prev, tipo: value }))}
                  >
                    <SelectTrigger className="text-sm">
                      <SelectValue placeholder="Tipo de emergencia" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="incendio">🔥 Incendio</SelectItem>
                      <SelectItem value="accidente">🚗 Accidente</SelectItem>
                      <SelectItem value="medica">🏥 Emergencia Médica</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    placeholder="Descripción del incidente"
                    value={nuevoIncidente.descripcion}
                    onChange={(e) => setNuevoIncidente((prev) => ({ ...prev, descripcion: e.target.value }))}
                    className="text-sm"
                  />
                  <Input
                    placeholder="Ubicación"
                    value={nuevoIncidente.ubicacion}
                    onChange={(e) => setNuevoIncidente((prev) => ({ ...prev, ubicacion: e.target.value }))}
                    className="text-sm"
                  />
                  <Button
                    onClick={agregarIncidente}
                    className="bg-accent hover:bg-accent/90 text-accent-foreground text-sm sm:col-span-1 lg:col-span-1"
                  >
                    Registrar
                  </Button>
                </div>
              </CardContent>
            </Card>

            <div className="flex items-center gap-4">
              <Select value={filtroEstado} onValueChange={setFiltroEstado}>
                <SelectTrigger className="w-full sm:w-48 text-sm">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los estados</SelectItem>
                  <SelectItem value="pendiente">Pendientes</SelectItem>
                  <SelectItem value="en_atencion">En Atención</SelectItem>
                  <SelectItem value="resuelto">Resueltos</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3 sm:space-y-4">
              {incidentesFiltrados.map((incidente) => (
                <Card
                  key={incidente.id}
                  className="hover:shadow-lg transition-all duration-200 border-l-4 border-l-primary"
                >
                  <CardContent className="p-3 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start justify-between gap-3 sm:gap-4">
                      <div className="flex-1 min-w-0 w-full">
                        <div className="flex items-start gap-2 sm:gap-3 mb-2">
                          <span className="text-xl sm:text-2xl flex-shrink-0">{getTipoIcon(incidente.tipo)}</span>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-base sm:text-lg text-foreground">{incidente.id}</h3>
                            <p className="text-muted-foreground text-sm sm:text-base">{incidente.descripcion}</p>
                          </div>
                        </div>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <MapPin className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                            <span className="truncate">{incidente.ubicacion}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="w-3 h-3 sm:w-4 sm:h-4 flex-shrink-0" />
                            {incidente.hora_reporte}
                          </div>
                          {incidente.tiempo_respuesta && (
                            <div className="text-emerald-600 font-medium">
                              Tiempo respuesta: {incidente.tiempo_respuesta}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-2">
                          <Badge variant={getEstadoBadge(incidente.estado)} className="text-xs">
                            {incidente.estado.replace("_", " ").toUpperCase()}
                          </Badge>
                          <Badge
                            variant={incidente.prioridad === "alta" ? "destructive" : "outline"}
                            className="text-xs"
                          >
                            Prioridad {incidente.prioridad}
                          </Badge>
                        </div>
                      </div>
                      <div className="w-full sm:w-auto sm:text-right">
                        <p className="text-xs sm:text-sm font-medium mb-2 text-foreground">Recursos Asignados:</p>
                        {incidente.recursos_asignados.length > 0 ? (
                          <div className="flex flex-wrap sm:flex-col gap-1">
                            {incidente.recursos_asignados.map((recurso) => (
                              <Badge key={recurso} variant="secondary" className="text-xs">
                                {recurso}
                              </Badge>
                            ))}
                          </div>
                        ) : (
                          <p className="text-muted-foreground text-xs sm:text-sm">Sin asignar</p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="mapa">
            <Card className="border-primary/20">
              <CardHeader className="bg-primary/5 p-3 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-primary text-sm sm:text-base">
                  <MapPin className="w-4 h-4 sm:w-5 sm:h-5" />
                  Mapa de Incidentes en Tiempo Real
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-6">
                <div className="bg-gradient-to-br from-primary/10 to-accent/10 rounded-lg h-64 sm:h-96 flex items-center justify-center relative overflow-hidden border border-primary/20">
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50"></div>
                  <div className="relative z-10 text-center p-4">
                    <MapPin className="w-12 h-12 sm:w-16 sm:h-16 text-primary mx-auto mb-4" />
                    <h3 className="text-lg sm:text-xl font-semibold mb-2 text-foreground">Mapa Interactivo</h3>
                    <p className="text-muted-foreground mb-4 text-sm sm:text-base">
                      Visualización geográfica de todos los incidentes activos
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4 max-w-md mx-auto">
                      {incidentes.slice(0, 4).map((inc, idx) => (
                        <div
                          key={inc.id}
                          className="bg-card p-2 sm:p-3 rounded-lg shadow-sm text-left border border-border"
                        >
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-sm">{getTipoIcon(inc.tipo)}</span>
                            <span className="font-medium text-xs sm:text-sm">{inc.id}</span>
                          </div>
                          <p className="text-xs text-muted-foreground truncate">{inc.ubicacion}</p>
                          <Badge size="sm" variant={getEstadoBadge(inc.estado)} className="mt-1 text-xs">
                            {inc.estado}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="recursos">
            <Card className="border-primary/20">
              <CardHeader className="bg-primary/5 p-3 sm:p-6">
                <CardTitle className="flex items-center gap-2 text-primary text-sm sm:text-base">
                  <Truck className="w-4 h-4 sm:w-5 sm:h-5" />
                  Estado de Recursos
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {["ambulancia", "bomberos", "policia"].map((tipo) => (
                    <div key={tipo} className="space-y-3">
                      <h3 className="font-semibold capitalize text-base sm:text-lg text-foreground">{tipo}</h3>
                      {recursos
                        .filter((r) => r.tipo === tipo)
                        .map((recurso) => (
                          <div
                            key={recurso.id}
                            className="flex items-center justify-between p-2 sm:p-3 bg-muted rounded-lg border border-border"
                          >
                            <span className="font-medium text-foreground text-sm sm:text-base">{recurso.id}</span>
                            <Badge
                              variant={recurso.estado === "disponible" ? "secondary" : "destructive"}
                              className="text-xs"
                            >
                              {recurso.estado}
                            </Badge>
                          </div>
                        ))}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reportes">
            <Card className="border-primary/20">
              <CardHeader className="bg-primary/5 p-3 sm:p-6">
                <CardTitle className="text-primary text-sm sm:text-base">Reportes y Estadísticas</CardTitle>
              </CardHeader>
              <CardContent className="p-3 sm:p-6">
                <div className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <div className="bg-muted p-3 sm:p-4 rounded-lg border border-border">
                      <h3 className="font-semibold mb-3 text-foreground text-sm sm:text-base">Incidentes por Tipo</h3>
                      <div className="space-y-2">
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">🔥 Incendios</span>
                          <span className="font-medium text-accent">
                            {incidentes.filter((i) => i.tipo === "incendio").length}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">🚗 Accidentes</span>
                          <span className="font-medium text-primary">
                            {incidentes.filter((i) => i.tipo === "accidente").length}
                          </span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span className="text-muted-foreground">🏥 Emergencias Médicas</span>
                          <span className="font-medium text-emerald-600">
                            {incidentes.filter((i) => i.tipo === "medica").length}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="bg-muted p-3 sm:p-4 rounded-lg border border-border">
                      <h3 className="font-semibold mb-3 text-foreground text-sm sm:text-base">
                        Tiempo Promedio de Respuesta
                      </h3>
                      <div className="text-center">
                        <div className="text-2xl sm:text-3xl font-bold text-primary mb-2">11.7 min</div>
                        <p className="text-xs sm:text-sm text-muted-foreground">Promedio últimas 24 horas</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                    <Button
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent text-sm"
                    >
                      Exportar PDF
                    </Button>
                    <Button
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent text-sm"
                    >
                      Exportar Excel
                    </Button>
                    <Button
                      variant="outline"
                      className="border-primary text-primary hover:bg-primary hover:text-primary-foreground bg-transparent text-sm"
                    >
                      Generar Reporte Mensual
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
