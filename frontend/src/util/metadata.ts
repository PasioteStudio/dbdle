import { metadataTemplate } from "@/app/layout"
import { Metadata } from "next"

export function generateTemplateMetadata(title:string,description:string):Metadata{
    metadataTemplate.title = title + " | DBDle"
    metadataTemplate.description = description
    metadataTemplate.openGraph!.title = title+" | DBDle"
    metadataTemplate.openGraph!.description = description
    metadataTemplate.openGraph!.url = "https://dbdle.pasiotestudio.hu/" + title.toLowerCase()
    metadataTemplate.twitter!.title = title+" | DBDle"
    metadataTemplate.twitter!.description = description

    return metadataTemplate
}