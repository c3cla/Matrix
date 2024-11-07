from rest_framework.permissions import BasePermission
from rest_framework_simplejwt.authentication import JWTAuthentication


class IsAdminUserRole(BasePermission):
    def has_permission(self, request, view):
        jwt_auth = JWTAuthentication()
        try:
            auth_header = request.headers.get('Authorization')
            if not auth_header:
                return False
            validated_token = jwt_auth.get_validated_token(auth_header.split()[1])
            return validated_token.get('role') == 'admin'
        except Exception:
            return False
