import { BaseClient, type FileInput } from './client.js'
import type {
  ExtractDocumentRequest,
  ExtractDocumentResponse,
  ValidateDocumentRequest,
  ValidateDocumentResponse,
} from './types.js'

export class DocumentsResource extends BaseClient {

  /**
   * Extract structured fields from a document image (synchronous).
   *
   * @example
   * const data = await kernaq.documents.extract({
   *   document:     fs.createReadStream('passport.jpg'),
   *   documentType: 'passport',
   *   country:      'GBR',
   * })
   * console.log(data.fields.document_number)
   */
  extract(req: ExtractDocumentRequest): Promise<ExtractDocumentResponse> {
    const fields: Record<string, string> = {}
    if (req.documentType) fields['document_type'] = req.documentType
    if (req.country)      fields['country']       = req.country

    return this.upload<ExtractDocumentResponse>('/documents/extract', fields, [
      {
        field:       'document',
        value:       req.document as FileInput,
        filename:    req.documentName ?? 'document.jpg',
        contentType: 'image/jpeg',
      },
    ])
  }

  /**
   * @deprecated This endpoint does not exist on the Kernaq API.
   * Use `extract()` for document OCR. This method will throw at runtime.
   * It is kept here to avoid breaking existing call sites — remove it from
   * your code and replace with `extract()`.
   */
  validate(_req: ValidateDocumentRequest): Promise<ValidateDocumentResponse> {
    return Promise.reject(
      new Error(
        'KernaqSDK: documents.validate() is not a valid API endpoint. ' +
        'Use documents.extract() to read document fields.'
      )
    )
  }
}
