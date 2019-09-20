# frozen_string_literal: true

module Response
  def json_response(obj, http_status = :ok)
    render json: obj, status: http_status
  end
end
