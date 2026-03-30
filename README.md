# password_check.py
COMMON_PASSWORDS = [
    "123456", "password", "123456789", "12345678", "12345",
    "1234567", "qwerty", "abc123", "football", "monkey",
    "letmein", "696969", "shadow", "master", "666666",
    "qwertyuiop", "123321", "mustang", "1234567890", "michael",
    "superman", "batman", "trustno1", "dragon", "passw0rd",
]


def is_common_password(password):
    """Check if the password is in the list of common passwords."""
    return password in COMMON_PASSWORDS


def main():
    """Main function to check password security."""
    password = input("Enter a password to check: ")
    if is_common_password(password):
        print("Warning: This password is too common. Please choose another.")
    else:
        print("Password seems acceptable.")


if __name__ == "__main__":
    main()








.gitlab-ci.yml :



stages:
  - lint
  - security

flake8_code:
  stage: lint
  image: python
  before_script:
    - pip install flake8
  script:
    - flake8 password_check.py
  allow_failure: true

security_code:
  stage: security
  image: python
  before_script:
    - pip install bandit
  script:
    - bandit -r password_check.py
  allow_failure: true
