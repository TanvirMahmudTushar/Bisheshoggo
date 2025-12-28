"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { FileText, Download, ArrowLeft, Calendar } from "lucide-react"
import Link from "next/link"

interface MedicalRecordsContentProps {
  userId: string
  records: any[]
}

export function MedicalRecordsContent({ userId, records }: MedicalRecordsContentProps) {
  const getRecordTypeColor = (type: string) => {
    switch (type) {
      case "prescription":
        return "bg-blue-500/10 text-blue-500"
      case "lab_report":
        return "bg-emerald-500/10 text-emerald-500"
      case "imaging":
        return "bg-purple-500/10 text-purple-500"
      case "consultation_notes":
        return "bg-amber-500/10 text-amber-500"
      default:
        return "bg-gray-500/10 text-gray-500"
    }
  }

  return (
    <div className="container max-w-4xl py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/dashboard">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="w-5 h-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Medical Records</h1>
          <p className="text-muted-foreground">Your health history and documents</p>
        </div>
      </div>

      {/* Records List */}
      {records.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <FileText className="w-12 h-12 mx-auto mb-4 text-muted-foreground opacity-50" />
            <p className="text-muted-foreground">No medical records yet</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {records.map((record: any) => (
            <Card key={record.id}>
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-1">{record.title}</h3>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className={getRecordTypeColor(record.record_type)}>
                        {record.record_type.replace("_", " ")}
                      </Badge>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        {new Date(record.record_date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>

                {record.description && <p className="text-sm text-muted-foreground mb-3">{record.description}</p>}

                {record.provider && (
                  <p className="text-sm mb-3">
                    <span className="font-medium">Provider:</span> {record.provider.full_name}
                  </p>
                )}

                {record.document_url && (
                  <Button size="sm" variant="outline" className="bg-transparent" asChild>
                    <a href={record.document_url} download>
                      <Download className="w-4 h-4 mr-1" />
                      Download Document
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
